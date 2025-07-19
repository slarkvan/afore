# CDN 配置说明

## 概述

本项目现在支持 CDN 模式，可以自动将 HTML 文件中的 `image/` 和 `video/` 路径替换为 CDN 地址。

## 功能特性

- ✅ 自动检测并替换 `image/` 和 `video/` 路径
- ✅ 支持 `src`、`href`、`poster` 属性
- ✅ 支持 CSS `url()` 引用
- ✅ 支持内联 `style` 属性中的 `background-image`
- ✅ 可通过环境变量灵活配置
- ✅ 开发模式下可以快速切换本地/CDN 模式

## 环境变量配置

### 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# 服务器端口
PORT=3000

# CDN 配置
# 是否启用 CDN 模式 (true/false)
ENABLE_CDN=true

# CDN 主机地址 (当 ENABLE_CDN=true 时使用)
CDN_HOST=https://cdn.example.com

# CDN 路径前缀 (可选，默认为空)
CDN_PATH_PREFIX=/static

# 环境模式
NODE_ENV=production
```

### 配置参数说明

| 参数 | 说明 | 示例 | 必需 |
|------|------|------|------|
| `ENABLE_CDN` | 是否启用 CDN 模式 | `true` 或 `false` | 是 |
| `CDN_HOST` | CDN 主机地址 | `https://cdn.example.com` | CDN 启用时必需 |
| `CDN_PATH_PREFIX` | CDN 路径前缀 | `/static` 或 `/assets` | 否 |

## 使用示例

### 场景 1: 基础 CDN 配置

```bash
ENABLE_CDN=true
CDN_HOST=https://cdn.afore-italy.com
```

**转换效果：**
- `image/logo.svg` → `https://cdn.afore-italy.com/image/logo.svg`
- `video/demo.mp4` → `https://cdn.afore-italy.com/video/demo.mp4`

### 场景 2: 带路径前缀的 CDN

```bash
ENABLE_CDN=true
CDN_HOST=https://cdn.afore-italy.com
CDN_PATH_PREFIX=/static
```

**转换效果：**
- `image/logo.svg` → `https://cdn.afore-italy.com/static/image/logo.svg`
- `video/demo.mp4` → `https://cdn.afore-italy.com/static/video/demo.mp4`

### 场景 3: 开发模式（本地文件）

```bash
ENABLE_CDN=false
```

**转换效果：**
- `image/logo.svg` → 保持原样，使用本地文件

## 支持的路径格式

系统会自动识别并转换以下格式的路径：

### HTML 属性
```html
<!-- src 属性 -->
<img src="image/logo.svg" alt="Logo">
<video src="video/demo.mp4"></video>

<!-- href 属性 -->
<a href="image/document.pdf">下载</a>

<!-- poster 属性 -->
<video poster="image/thumbnail.jpg" src="video/demo.mp4"></video>
```

### CSS 样式
```html
<!-- 内联样式 -->
<div style="background-image: url('image/bg.jpg')"></div>

<!-- CSS url() 函数 -->
<style>
.hero { background: url('image/hero-bg.jpg'); }
</style>
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件并配置所需参数。

### 3. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# PM2 模式
npm run pm2:start
```

### 4. 验证配置

启动服务后，控制台会显示 CDN 配置状态：

```
🚀 Afore Italy 网站正在运行在 http://localhost:3000
📁 静态文件服务目录: /path/to/static
🌐 CDN 模式已启用
📡 CDN 主机: https://cdn.afore-italy.com
📂 CDN 路径前缀: /static
```

## 注意事项

1. **缓存**：CDN 模式下，HTML 文件会动态处理，不会被浏览器缓存。静态资源仍然可以正常缓存。

2. **性能**：HTML 文件的路径替换是实时进行的，对于大文件可能会有轻微的延迟。

3. **兼容性**：现有的本地静态文件服务保持不变，只有 HTML 文件会被处理。

4. **路径格式**：系统会自动处理各种路径格式（`./image/`、`/image/`、`image/`）。

## 故障排除

### CDN 模式未生效

1. 检查 `.env` 文件是否存在且配置正确
2. 确认 `ENABLE_CDN=true`
3. 检查 `CDN_HOST` 是否设置
4. 重启服务器

### 路径转换不正确

1. 检查 `CDN_PATH_PREFIX` 配置
2. 确认 HTML 中的路径格式是否支持
3. 查看服务器控制台日志

### 图片/视频加载失败

1. 确认 CDN 服务器可访问
2. 检查 CDN 上的文件路径是否正确
3. 验证 CORS 设置（如果需要） 