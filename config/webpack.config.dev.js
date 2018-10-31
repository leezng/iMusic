const webpack = require('webpack');
const config = require('./index');
const path = require('path');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...baseConfig,

  target: 'electron-renderer',

  devtool: 'cheap-module-eval-source-map',

  entry: [
    // hot reload
    `webpack-hot-middleware/client?path=http://${config.dev.devServer.host}:${config.dev.devServer.port}/__webpack_hmr`,
    // app
    'src/renderer/index.js'
  ],

  output: {
    path: config.build.outputPath,
    filename: 'bundle.js',
    publicPath: config.dev.publicPath
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.dev.env
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true
    })
  ]
};
