const http = require("http");
const express = require("express");
const cors = require("cors");
const loginRouter = require("./routes/login.js");
const fileRouter = require("./routes/upload.js");

// 使用Express创建HTTP服务器
const app = express();
app.use(express.json());
app.use(cors());
app.use(loginRouter);
app.use(fileRouter);

// 启动服务器监听3000端口
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
