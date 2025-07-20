require("dotenv").config();
const express = require("express");
const path = require("path");
const { cdnMiddleware, cssMiddleware } = require("./middleware/cdn");

const app = express();
const PORT = process.env.PORT || 3000;

// 设置 EJS 模板引擎
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

// CDN 配置
const ENABLE_CDN = process.env.ENABLE_CDN === "true";
const CDN_HOST = process.env.CDN_HOST || "";
const CDN_PATH_PREFIX = process.env.CDN_PATH_PREFIX || "";

// 应用 CDN 中间件（HTML 模板）
app.use(cdnMiddleware);

// CSS 文件 CDN 处理中间件（需要在静态文件中间件之前）
app.use(cssMiddleware);

// 页面路由映射
const pageRoutes = {
  "/": {
    template: "homepage",
    title: "Afore Italia - Home",
    stylesheet: "homepage_style.css"
  },
  "/prodotti.html": {
    template: "prodotti",
    title: "Prodotti - Afore Italia",
    stylesheet: "prodotti.css"
  },
  "/soluzione.html": {
    template: "soluzione",
    title: "Soluzioni - Afore Italia",
    stylesheet: "soluzione.css"
  },
  "/chieafore.html": {
    template: "chieafore",
    title: "Chi è Afore - Afore Italia",
    stylesheet: "chieafore_style.css"
  },
  "/contatti.html": {
    template: "contatti",
    title: "Contatti - Afore Italia",
    stylesheet: "contatti.css"
  },
  "/documentazione.html": {
    template: "documentazione",
    title: "Documentazione - Afore Italia",
    stylesheet: "documentazione.css"
  },
  "/Assistenza.html": {
    template: "assistenza",
    title: "Assistenza - Afore Italia",
    stylesheet: "Assistenza.css"
  },
  "/eventi.html": {
    template: "eventi",
    title: "Eventi - Afore Italia",
    stylesheet: "eventi_style.css"
  },
};

// 动态路由处理
Object.keys(pageRoutes).forEach((route) => {
  app.get(route, (req, res) => {
    const pageConfig = pageRoutes[route];
    res.render(pageConfig.template, {
      title: pageConfig.title,
      stylesheet: pageConfig.stylesheet,
    });
  });
});

// 静态文件中间件，但跳过HTML文件（由EJS模板处理）
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    return next(); // 跳过HTML文件，让路由处理
  }
  express.static(path.join(__dirname, "..", "static"))(req, res, next);
});

// 404处理
app.use((req, res) => {
  res.status(404).render("homepage", {
    title: "Afore Italia - Home",
    stylesheet: "homepage_style.css"
  });
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
