const path = require('path');

const serverPort = 11845;

process.env.PORT = serverPort

const config = {
  dev: {
    env: '"development"',
    publicPath: '/',
    // 开发服务器
    devServer: {
      port: 8086,
      host: 'localhost'
    },
    // 开发时代理配置
    proxyTable: {
      '/api': {
        target: `http://localhost:${serverPort}`,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // remove pre path
        }
      }
    }  
  },

  build: {
    env: '"production"',
    publicPath: './',
    outputPath: path.resolve(__dirname, '../dist'),
    port: serverPort
  }
};

module.exports = config
