const serverPort = 11845;

const config = {
  dev: {
    publicPath: '/',
    // 开发服务器
    devServer: {
      port: 8086,
      host: 'localhost',
    },
    // 开发时代理配置
    proxyTable: {
      '/api': {
        target: `http://localhost:${serverPort}`,
        secure: false,
        changeOrigin: true,
      },
    },
  },

  build: {
    publicPath: './',
    port: serverPort,
  },
};

module.exports = config;
