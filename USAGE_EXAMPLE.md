# CDN 功能使用示例

## 快速开始

### 1. 准备工作

确保您已经安装了依赖：
```bash
npm install
```

### 2. 配置 CDN

创建 `.env` 文件：
```bash
# 启用 CDN 模式
ENABLE_CDN=true

# 设置您的 CDN 主机
CDN_HOST=https://your-cdn-domain.com

# 可选：设置路径前缀
CDN_PATH_PREFIX=/assets

# 服务器端口
PORT=3000
```

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 或者生产模式
npm start
```

### 4. 验证效果

启动后，您会看到类似的输出：
```
🚀 Afore Italy 网站正在运行在 http://localhost:3000
📁 静态文件服务目录: /path/to/static
🌐 CDN 模式已启用
📡 CDN 主机: https://your-cdn-domain.com
📂 CDN 路径前缀: /assets
```

## 路径转换示例

### 启用 CDN 前后对比

**原始 HTML：**
```html
<img src="image/logo_afore_dark.svg" alt="Afore Logo">
<video poster="image/thumbnail.jpg" src="video/demo.mp4"></video>
<div style="background-image: url('image/hero-bg.jpg')"></div>
```

**启用 CDN 后（自动转换）：**
```html
<img src="https://your-cdn-domain.com/assets/image/logo_afore_dark.svg" alt="Afore Logo">
<video poster="https://your-cdn-domain.com/assets/image/thumbnail.jpg" src="https://your-cdn-domain.com/assets/video/demo.mp4"></video>
<div style="background-image: url('https://your-cdn-domain.com/assets/image/hero-bg.jpg')"></div>
```

## 不同配置场景

### 场景 1：基础 CDN（无路径前缀）

```bash
ENABLE_CDN=true
CDN_HOST=https://cdn.afore-italy.com
```

转换结果：
- `image/logo.svg` → `https://cdn.afore-italy.com/image/logo.svg`

### 场景 2：带路径前缀的 CDN

```bash
ENABLE_CDN=true
CDN_HOST=https://cdn.afore-italy.com
CDN_PATH_PREFIX=/static
```

转换结果：
- `image/logo.svg` → `https://cdn.afore-italy.com/static/image/logo.svg`

### 场景 3：多级路径前缀

```bash
ENABLE_CDN=true
CDN_HOST=https://cdn.afore-italy.com
CDN_PATH_PREFIX=/v1/assets
```

转换结果：
- `image/logo.svg` → `https://cdn.afore-italy.com/v1/assets/image/logo.svg`

## 测试您的配置

### 方法 1：运行测试脚本

```bash
node test-cdn.js
```

这会显示路径转换的详细过程。

### 方法 2：访问网页检查

1. 启动服务器：`npm start`
2. 打开浏览器访问：`http://localhost:3000`
3. 查看页面源代码，确认图片路径已正确转换
4. 打开开发者工具的网络面板，确认资源从 CDN 加载

### 方法 3：使用 curl 测试

```bash
# 测试主页的 HTML 转换
curl http://localhost:3000/ | grep "cdn.afore-italy.com"

# 测试其他页面
curl http://localhost:3000/prodotti.html | grep "cdn.afore-italy.com"
```

## 常见问题解决

### Q: CDN 模式启动但路径没有转换？

**检查清单：**
1. ✅ `.env` 文件是否存在且配置正确
2. ✅ `ENABLE_CDN=true` 是否设置
3. ✅ `CDN_HOST` 是否配置
4. ✅ 重启服务器
5. ✅ 清除浏览器缓存

### Q: 某些图片路径没有被转换？

**可能原因：**
- 路径格式不受支持（如外部链接）
- 路径不包含 `image/` 或 `video/`
- 路径在 JavaScript 代码中（系统只处理 HTML）

### Q: CDN 资源加载失败？

**检查项目：**
1. CDN 服务器是否可访问
2. 文件是否已上传到 CDN
3. 路径拼接是否正确
4. CORS 设置是否正确

## 性能优化建议

### 1. CDN 配置优化

- 使用地理分布的 CDN 节点
- 启用 Gzip 压缩
- 设置适当的缓存策略
- 配置 CORS 头

### 2. 资源优化

- 压缩图片文件
- 使用现代图片格式（WebP、AVIF）
- 启用懒加载
- 使用响应式图片

### 3. 监控和调试

- 监控 CDN 响应时间
- 跟踪资源加载失败率
- 使用浏览器开发者工具分析

## 部署建议

### 生产环境配置

```bash
# .env (生产环境)
NODE_ENV=production
ENABLE_CDN=true
CDN_HOST=https://cdn.yourdomain.com
CDN_PATH_PREFIX=/v1
PORT=3000
```

### PM2 部署

```bash
# 启动
npm run pm2:start

# 更新配置后重启
npm run pm2:restart

# 查看日志
npm run pm2:logs
```

### Docker 部署

如果使用 Docker，记得在容器中传递环境变量：

```bash
docker run -d \
  -e ENABLE_CDN=true \
  -e CDN_HOST=https://cdn.yourdomain.com \
  -e CDN_PATH_PREFIX=/assets \
  -p 3000:3000 \
  your-image-name
``` 