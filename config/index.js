const path = require('path');

const serverPort = 11845;
const devServerPort = 8086;

const config = {
  // 开发服务器
  devServer: {
    port: devServerPort,
    host: 'localhost'
  },

  // 服务器
  server: {
    port: serverPort
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
      // filter: function (pathname, req) {
      //   return pathname !== '/' && pathname !== '/bundle.js'
      // }
    }
  },

  dist: path.resolve(__dirname, '../dist')
};

module.exports = config
