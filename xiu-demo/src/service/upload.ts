import { get, post } from './http';

// 开始上传时获取上传详情
export const getUploadDetail = (data: { md5: string; suffix: string }) => get('/getUploadDetail', data);

//上传分片
export const upload = (data: object) => post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// 合并文件
export const merge = (data: object | undefined) => {
  return get('/mergeFile', data);
};
