const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const multiparty = require("multiparty");
const UPLOAD_DIR = path.resolve(process.cwd(), "./file"); // 完整文件存放在file下,每个文件的片存在文件md5命名的文件夹下

/**
 * @message: 检查文件之前上传情况: 未上传null,上传一部分[a,b,c],已上传 list=[]
 * @param {*} md5 完整文件唯一标识
 * @param {*} suffix 文件后缀
 * @response {data: array,success: boolean,err: any}
 */
router.get("/getUploadDetail", (req, res) => {
  const { md5, suffix } = req.query;
  let list = [];
  let data = { isUploaded: false, list };
  const { filePath, dirPath } = getDirPathAndFilePath(md5, suffix);

  const isUploaded = fs.existsSync(filePath);
  if (isUploaded) {
    data = { ...data, isUploaded };
  }

  const isUploading = fs.existsSync(dirPath);
  if (isUploading) {
    list = fs.readdirSync(dirPath); // 获取已上传的文件片段
    list = sortFiles(list);
    data = { ...data, list };
  }

  res.send({
    data,
    err: null,
    success: true,
  });
});

function getDirPathAndFilePath(md5, suffix) {
  const dirPath = path.join(UPLOAD_DIR, `./${md5}`);
  const filePath = path.join(UPLOAD_DIR, `./${md5}.${suffix}`);
  return { dirPath, filePath };
}

/**
 * @message: 文件片段以index-MD5.suffix命名保存在md5命名的文件夹中
 * @param {*} md5 完整文件唯一标识
 * @param {*} chunkName 当前文件片段名称
 * @param {*} suffix 文件后缀
 * @param {*} file 文件片段内容
 */
router.post("/upload", (req, res) => {
  const form = new multiparty.Form();
  let isSuccess = false;
  let err = null;

  form.parse(req, async (error, fields, files) => {
    if (error) {
      err = error;
    } else {
      isSuccess = await saveFile(fields, files);
    }

    res.send({
      success: isSuccess,
      err,
      data: null,
    });
  });
});

async function saveFile(fields, files) {
  const { md5, chunkName, suffix } = fields;
  const { dirPath, filePath } = getDirPathAndFilePath(md5, suffix);
  const hasFile = fs.existsSync(filePath);
  if (!hasFile) {
    createDir(dirPath);
    return await waitFile(dirPath, chunkName, files.file[0]);
  }
  return true;
}

function createDir(dirPath) {
  const hasDir = fs.existsSync(dirPath);
  if (!hasDir) {
    fs.mkdirSync(dirPath);
  }
}

function waitFile(dirPath, chunkName, file) {
  return new Promise((resolve, reject) => {
    const fragmentPath = path.join(dirPath, `./${chunkName}`);
    const buffer = fs.readFileSync(file.path);
    fs.writeFile(fragmentPath, buffer, (err) => {
      if (err) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

/**
 * @message: 合并md5命名文件夹内所有文件,并删除该文件夹,合并后检查文件的md5是否一致
 * @param {*} md5 完整文件唯一标识
 * @param {*} suffix 文件后缀
 */
router.get("/mergeFile", async (req, res) => {
  const { md5, suffix } = req.query;
  const { dirPath, filePath } = getDirPathAndFilePath(md5, suffix);

  mergeFile(dirPath, filePath);

  const isSame = await isSameFile(filePath, md5);
  if (!isSame) {
    fs.unlinkSync(filePath);
    res.send({ success: false, err: "文件已经损坏请重新上传!", data: null });
    return;
  }

  res.send({ success: true, err: null, data: null });
});

function mergeFile(dirPath, filePath) {
  let list = fs.readdirSync(dirPath);
  list = sortFiles(list);
  list.forEach((item) => {
    const chunkPath = path.join(dirPath, item);
    const buffer = fs.readFileSync(chunkPath);
    fs.appendFileSync(filePath, buffer);
    fs.unlinkSync(chunkPath);
  });
  fs.rmdirSync(dirPath);
}
function sortFiles(list) {
  list.sort((a, b) => {
    const aRes = a.match(/^(\d+)-(.+)$/);
    const bRes = b.match(/^(\d+)-(.+)$/);
    return aRes[1] - bRes[1];
  });
  return list;
}

async function isSameFile(filePath, md5) {
  let currMd5 = await getMd5byFile(filePath);
  return currMd5 === md5;
}

function getMd5byFile(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const hash = crypto.createHash("md5");

    readStream.on("data", (chunk) => {
      hash.update(chunk);
    });
    readStream.on("end", () => {
      const fileMd5 = hash.digest("hex");
      resolve(fileMd5);
    });
    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = router;
