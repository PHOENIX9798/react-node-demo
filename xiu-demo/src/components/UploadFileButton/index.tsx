import { useState } from "react";
import SparkMD5 from 'spark-md5';
import { Button, message, Upload, type UploadFile, type UploadProps } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { getUploadDetail, upload, merge } from '@/service/upload.ts';

type CallBackprops = {
  res: any[]; // 结果数组
  task: () => Promise<any>; // 当前正在执行的任务
};
type TaskCallback = (info: CallBackprops) => void;

const UploadButton: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const { md5, suffix } = await getIdentityAndName(fileList[0]);
      const [data, err] = await getUploadDetail({ md5, suffix });
      if (err) throw new Error('获取文件信息有误，上传失败!');

      const { isUploaded, list } = data;
      if (isUploaded) {
        message.success('上传成功!');
        return;
      }

      const file = fileList[0];
      const size = getChunkSize(file.size as number);
      const chunks = getChunks(file, size, md5, suffix, list);
      const tasks = packageTasks(chunks);

      await runTasks(tasks, 4, 2); // 并发数=4，重试=2

      const [_, mergeError] = await merge({ md5, suffix });
      if (mergeError) throw new Error(mergeError);

      message.success('上传成功');
    } catch (e: any) {
      message.error(e.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 获取文件md5和后缀
  const getIdentityAndName = (file: any): Promise<{ md5: string; suffix: string }> => {
    return new Promise((resolve, reject) => {
      const suffix = file.name.split('.')[1];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = e => {
        const buffer = e.target?.result;
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer as ArrayBuffer);
        const md5 = spark.end();
        resolve({ md5, suffix });
      };
      fileReader.onerror = (error) => reject(error);
    });
  };

  // 获取分片大小
  const getChunkSize = (fileSize: number) => {
    const defaultSize = 1 * 1024 * 1024; // 每片1M
    const defaultCount = 100;
    const maxCount = Math.ceil(fileSize / defaultSize);
    const maxSize = Math.ceil(fileSize / defaultCount);
    return maxCount > defaultCount ? maxSize : defaultSize;
  };

  // 获取分片
  const getChunks = (file: UploadFile, size: number, md5: string, suffix: string, list: string[]) => {
    let index = 0;
    const result: FormData[] = [];
    const fileSize = file?.size;
    if (!fileSize) return result;

    const end = Math.ceil(fileSize / size);
    while (index < end) {
      const chunk = file.slice(index * size, (index + 1) * size);
      const chunkName = `${index}-${md5}.${suffix}`;
      if (!isUploadedFile(list, chunkName)) {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('md5', md5);
        formData.append('chunkName', chunkName);
        result.push(formData);
      }
      index++;
    }
    return result;
  };

  const isUploadedFile = (list: string[], name: string) => list.includes(name);

  // 包装任务队列
  const packageTasks = (chunks: FormData[]) => chunks.map(item => () => upload(item));

  // 并发执行任务,控制任务并发数
  const paralleTask = (tasks: any[], max = 4, callback?: TaskCallback) => {
    if (tasks.length === 0) return;

    return new Promise((resolve, reject) => {
      let nextIndex = 0;
      let finishedIndex = 0;
      const len = tasks.length;
      const _run = () => {
        const task = tasks[nextIndex];
        nextIndex++;
        task().then((data: any) => {
          finishedIndex++;
          callback && callback({ res: data, task }); // 将任务相关情况暴露出去
          const isFinished = finishedIndex === len;
          if (isFinished) {
            resolve(0);
          }
          const hasTask = nextIndex < len;
          if (hasTask) {
            _run();
          }
        });
      }
      for (let i = 0; i < max && i < len; i++) {
        _run();
      }
    });
  };

  // 并发执行 + 错误重试
  const runTasks = async (
    tasks: Array<() => Promise<any>>,
    maxConcurrent = 4,
    maxRetry = 2,
    callback?: TaskCallback
  ) => {
    const errTasks: (() => Promise<any>)[] = [];
    const runOnce = async (taskList: Array<() => Promise<any>>) => {
      await paralleTask(taskList, maxConcurrent, ({ res, task }) => {
        callback?.({ res, task });
        const err = res[1];
        if (err) errTasks.push(task);
      });
    };

    // 跑一次上传
    await runOnce(tasks);

    // 如果有错误任务就重试
    let retryCount = 0;
    while (errTasks.length > 0 && retryCount < maxRetry) {
      const pending = errTasks.splice(0, errTasks.length);
      await runOnce(pending);
      retryCount++;
    }

    if (errTasks.length > 0) {
      throw new Error(`上传失败，有 ${errTasks.length} 个分片在重试后仍未成功`);
    }
  }

  const props: UploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  );
};

export default UploadButton;
