require("dotenv").config();
const express = require("express");
const path = require("path");
const cdnMiddleware = require("./middleware/cdn");

const app = express();
const PORT = process.env.PORT || 3000;

// CDN 配置
const ENABLE_CDN = process.env.ENABLE_CDN === "true";
const CDN_HOST = process.env.CDN_HOST || "";
const CDN_PATH_PREFIX = process.env.CDN_PATH_PREFIX || "";

// 应用 CDN 中间件
app.use(cdnMiddleware);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "..", "static")));

// 默认路由，返回主页
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "static", "homepage.html"));
});

// 404处理
app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "..", "static", "homepage.html"));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Afore Italy 网站正在运行在 http://localhost:${PORT}`);
  console.log(`📁 静态文件服务目录: ${path.join(__dirname, "..", "static")}`);

  // CDN 状态信息
  if (ENABLE_CDN) {
    console.log(`🌐 CDN 模式已启用`);
    console.log(`📡 CDN 主机: ${CDN_HOST}`);
    if (CDN_PATH_PREFIX) {
      console.log(`📂 CDN 路径前缀: ${CDN_PATH_PREFIX}`);
    }
  } else {
    console.log(`💾 本地模式 (CDN 未启用)`);
  }

  console.log("🌟 可访问的页面:");
  console.log("   - 主页: http://localhost:" + PORT);
  console.log("   - 产品: http://localhost:" + PORT + "/prodotti.html");
  console.log("   - 解决方案: http://localhost:" + PORT + "/soluzione.html");
  console.log("   - 谁是Afore: http://localhost:" + PORT + "/chieafore.html");
  console.log("   - 联系我们: http://localhost:" + PORT + "/contatti.html");
  console.log("   - 文档: http://localhost:" + PORT + "/documentazione.html");
  console.log("   - 协助: http://localhost:" + PORT + "/Assistenza.html");
  console.log("   - 活动: http://localhost:" + PORT + "/eventi.html");
});
