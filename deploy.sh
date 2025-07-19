#!/bin/bash

# Afore Italy 网站部署脚本

echo "🚀 开始部署 Afore Italy 网站..."

# 检查 Node.js 是否安装
if ! command -v node &>/dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &>/dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 创建日志目录
echo "📁 创建日志目录..."
mkdir -p logs

# 检查 PM2 是否全局安装，如果没有则全局安装
if ! command -v pm2 &>/dev/null; then
    echo "🔧 安装 PM2 进程管理器..."
    npm install -g pm2
fi

# 停止现有的 PM2 进程（如果存在）
echo "🛑 停止现有服务..."
pm2 delete afore-italy 2>/dev/null || true

# 启动 PM2 服务
echo "🚀 启动 PM2 服务..."
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
echo "💾 保存 PM2 配置..."
pm2 save

# 设置 PM2 开机自启
echo "⚙️  设置开机自启..."
pm2 startup

echo "✅ 部署完成！"
echo ""
echo "🌟 服务状态:"
pm2 status
echo ""
echo "📝 查看日志: npm run pm2:logs"
echo "🔄 重启服务: npm run pm2:restart"
echo "📊 查看状态: npm run pm2:status"
echo ""
echo "🌐 网站访问地址: http://localhost:3000"
