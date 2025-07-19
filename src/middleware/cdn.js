const path = require("path");
const fs = require("fs");

// CDN 配置
const ENABLE_CDN = process.env.ENABLE_CDN === "true";
const CDN_HOST = process.env.CDN_HOST || "";
const CDN_PATH_PREFIX = process.env.CDN_PATH_PREFIX || "";

// 构建完整的 CDN URL
function buildCdnUrl(originalPath) {
  if (!ENABLE_CDN || !CDN_HOST) {
    return originalPath;
  }

  // 移除开头的 ./ 或 /
  const cleanPath = originalPath.replace(/^\.?\//, "");

  // 构建 CDN URL
  const cdnUrl = CDN_HOST.endsWith("/") ? CDN_HOST.slice(0, -1) : CDN_HOST;
  const pathPrefix = CDN_PATH_PREFIX
    ? CDN_PATH_PREFIX.endsWith("/")
      ? CDN_PATH_PREFIX.slice(0, -1)
      : CDN_PATH_PREFIX
    : "";

  return `${cdnUrl}${pathPrefix}/${cleanPath}`;
}

// HTML 文件 CDN 处理中间件
function cdnMiddleware(req, res, next) {
  // 只处理 HTML 文件请求
  if (!req.path.endsWith(".html") && req.path !== "/") {
    return next();
  }

  // 如果没有启用 CDN，直接继续
  if (!ENABLE_CDN) {
    return next();
  }

  // 确定要读取的文件路径
  let filePath;
  if (req.path === "/") {
    filePath = path.join(__dirname, "..", "..", "static", "homepage.html");
  } else {
    filePath = path.join(__dirname, "..", "..", "static", req.path);
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return next();
  }

  // 读取并处理 HTML 文件
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return next();
    }

    // 替换 image/ 和 video/ 路径
    let processedHtml = data;

    // 替换各种形式的 image/ 路径（避免重复处理已转换的 URL）
    processedHtml = processedHtml.replace(
      /(src|href|poster)=["'](?!https?:\/\/)([^"']*(?:image|video)\/[^"']*)["']/gi,
      (match, attr, path) => {
        const newPath = buildCdnUrl(path);
        return `${attr}="${newPath}"`;
      }
    );

    // 替换 CSS 中的 url() 引用（避免重复处理已转换的 URL）
    processedHtml = processedHtml.replace(
      /url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)/gi,
      (match, path) => {
        const newPath = buildCdnUrl(path);
        return `url('${newPath}')`;
      }
    );

    // 替换 style 属性中的背景图片（避免重复处理已转换的 URL）
    processedHtml = processedHtml.replace(
      /background-image:\s*url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)/gi,
      (match, path) => {
        const newPath = buildCdnUrl(path);
        return `background-image: url('${newPath}')`;
      }
    );

    // 设置正确的 Content-Type 并发送处理后的 HTML
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(processedHtml);
  });
}

module.exports = cdnMiddleware;
