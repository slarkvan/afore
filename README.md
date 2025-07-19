# Afore Italy 网站

一个基于 Express.js 的静态网站服务器，支持灵活的 CDN 配置。

## 新功能：CDN 支持 🌐

现在支持自动将 HTML 文件中的 `image/` 和 `video/` 路径替换为 CDN 地址！

### 快速开始

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **配置 CDN**（可选）：
   创建 `.env` 文件：
   ```bash
   ENABLE_CDN=true
   CDN_HOST=https://your-cdn-domain.com
   CDN_PATH_PREFIX=/assets
   ```

3. **启动服务器**：
   ```bash
   npm start
   # 或开发模式
   npm run dev
   ```

### CDN 功能特性

- ✅ 自动检测并替换 `image/` 和 `video/` 路径
- ✅ 支持 `src`、`href`、`poster` 属性
- ✅ 支持 CSS `url()` 引用和内联样式
- ✅ 可通过环境变量灵活配置
- ✅ 避免重复处理已转换的 URL
- ✅ 开发模式下可快速切换本地/CDN 模式

### 路径转换示例

**启用 CDN 前：**
```html
<img src="image/logo.svg" alt="Logo">
<video poster="image/thumbnail.jpg" src="video/demo.mp4"></video>
```

**启用 CDN 后：**
```html
<img src="https://your-cdn-domain.com/assets/image/logo.svg" alt="Logo">
<video poster="https://your-cdn-domain.com/assets/image/thumbnail.jpg" src="https://your-cdn-domain.com/assets/video/demo.mp4"></video>
```

## 详细文档

- 📖 [CDN 设置说明](CDN_SETUP.md) - 详细的配置指南
- 🚀 [使用示例](USAGE_EXAMPLE.md) - 快速开始和最佳实践

## 项目结构

```
afore-italy-site/
├── server.js           # 主服务器文件（包含 CDN 功能）
├── package.json        # 依赖配置
├── static/            # 静态文件目录
│   ├── *.html         # HTML 页面
│   ├── *.css          # 样式文件
│   ├── image/         # 图片资源
│   └── video/         # 视频资源
├── .env               # 环境变量配置（可选）
└── logs/              # 日志文件
```

## 可用脚本

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# PM2 管理
npm run pm2:start    # 启动
npm run pm2:stop     # 停止
npm run pm2:restart  # 重启
npm run pm2:logs     # 查看日志
```

## 环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|------|
| `PORT` | 服务器端口 | `3000` | `3000` |
| `ENABLE_CDN` | 启用 CDN 模式 | `false` | `true` |
| `CDN_HOST` | CDN 主机地址 | - | `https://cdn.example.com` |
| `CDN_PATH_PREFIX` | CDN 路径前缀 | - | `/static` |

## 技术栈

- **后端**: Node.js + Express.js
- **配置管理**: dotenv
- **进程管理**: PM2
- **开发工具**: nodemon

## 部署

### 本地开发
```bash
npm run dev
```

### 生产部署
```bash
# 使用 PM2
npm run pm2:start

# 或直接启动
npm start
```

### Docker 部署
```bash
docker run -d \
  -e ENABLE_CDN=true \
  -e CDN_HOST=https://your-cdn.com \
  -p 3000:3000 \
  your-image-name
```

## 许可证

MIT License 