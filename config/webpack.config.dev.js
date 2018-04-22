const webpack = require('webpack');
const config = require('./index');
const path = require('path');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { host, port } = config.server;

module.exports = {
  ...baseConfig,

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer',

  devtool: 'cheap-module-eval-source-map',

  entry: [
    // `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
    // 'babel-polyfill',
    'src/index.js'
  ],

  output: {
    path: config.dist,
    filename: 'bundle.js',
    publicPath: '/'
  },

  plugins: [
    // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
    new webpack.HotModuleReplacementPlugin(),

    // NODE_ENV should be production so that modules do not perform certain development checks
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true
    })
  ]
};
