const http = require("http");
const express = require("express");
const { getPubKeyPem, privateDecrypt } = require("./keys");
const { generateToken, authenticateToken } = require("./jwt");

// 使用Express创建HTTP服务器
const app = express();
app.use(express.json());

// 获取密钥
app.get("/publicKey", (req, res) => {
  res.set("Content-Type", "application/x-pem-file");
  const pub_key = getPubKeyPem();
  res.send({
    data: { pub_key },
    err: null,
    success: true,
  });
});

// 登陆
app.post("/login", (req, res) => {
  // 获取post请求的参数进行解密
  const { username, password } = privateDecrypt(req.body.encrypted);
  if ((username === "admin", password === "admin")) {
    // 整个模拟数据
    // 登录成功,签发token
    const token = generateToken({ username }); // 签发token的时候把用户名带上
    res.send({
      data: { token },
      err: null,
      success: true,
    });
    return;
  }
  res.send({
    data: "",
    err: "没有找到用户",
    success: false,
    code: 10034,
  });
});

// 启动服务器监听3000端口
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
