module.exports = {
  apps: [
    {
      name: "afore-italy",
      script: "src/server.js",
      instances: "max", // 使用所有可用的CPU核心
      exec_mode: "cluster", // 集群模式
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // 生产环境配置
      max_memory_restart: "1G", // 内存达到1G时重启
      min_uptime: "10s", // 最小运行时间
      max_restarts: 10, // 最大重启次数
      autorestart: true, // 自动重启
      watch: false, // 生产环境不监听文件变化
      ignore_watch: ["node_modules", "logs", ".git", ".DS_Store"],
      // 日志配置
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // 其他配置
      kill_timeout: 5000,
      listen_timeout: 8000,
      shutdown_with_message: true,
    },
    {
      name: "afore-italy-dev",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      watch: true,
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs", ".git", ".DS_Store"],
      autorestart: true,
      max_restarts: 5,
    },
  ],
};
