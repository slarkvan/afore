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

// EJS 渲染结果 CDN 处理中间件
function cdnMiddleware(req, res, next) {
  // 如果没有启用 CDN，直接继续
  if (!ENABLE_CDN) {
    return next();
  }

  // 保存原始的 res.render 方法
  const originalRender = res.render;

  // 重写 res.render 方法来处理 CDN 转换
  res.render = function (view, options, callback) {
    // 调用原始 render 方法获取渲染结果
    originalRender.call(this, view, options, (err, html) => {
      if (err) {
        if (callback) return callback(err);
        return next(err);
      }

      // 对渲染后的 HTML 进行 CDN 路径替换
      let processedHtml = html;

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

      // 替换 background 属性中的 url() 引用（兼容 background:url() 简写形式）
      processedHtml = processedHtml.replace(
        /background:\s*url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)([^;}]*)/gi,
        (match, path, additionalProps) => {
          const newPath = buildCdnUrl(path);
          return `background: url('${newPath}')${additionalProps}`;
        }
      );

      if (callback) {
        callback(null, processedHtml);
      } else {
        res.send(processedHtml);
      }
    });
  };

  next();
}

// CSS 文件 CDN 处理中间件
function cssMiddleware(req, res, next) {
  // 如果没有启用 CDN 或不是 CSS 文件，直接继续
  if (!ENABLE_CDN || !req.path.endsWith('.css')) {
    return next();
  }

  // 构建 CSS 文件的完整路径
  const cssFilePath = path.join(__dirname, '..', '..', 'static', req.path);

  // 检查文件是否存在
  if (!fs.existsSync(cssFilePath)) {
    return next();
  }

  // 读取 CSS 文件内容
  fs.readFile(cssFilePath, 'utf8', (err, data) => {
    if (err) {
      return next(err);
    }

    // 处理 CSS 中的 CDN 路径
    let processedCss = data;

    // 替换 background: url() 形式
    processedCss = processedCss.replace(
      /background:\s*url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)([^;}]*)/gi,
      (match, path, additionalProps) => {
        const newPath = buildCdnUrl(path);
        return `background: url('${newPath}')${additionalProps}`;
      }
    );

    // 替换 background-image: url() 形式
    processedCss = processedCss.replace(
      /background-image:\s*url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)/gi,
      (match, path) => {
        const newPath = buildCdnUrl(path);
        return `background-image: url('${newPath}')`;
      }
    );

    // 替换其他 url() 引用
    processedCss = processedCss.replace(
      /url\(['"]?(?!https?:\/\/)([^'"]*(?:image|video)\/[^'"]*)['"]?\)/gi,
      (match, path) => {
        const newPath = buildCdnUrl(path);
        return `url('${newPath}')`;
      }
    );

    // 设置正确的 Content-Type
    res.setHeader('Content-Type', 'text/css');
    res.send(processedCss);
  });
}

module.exports = {
  cdnMiddleware,
  cssMiddleware
};
