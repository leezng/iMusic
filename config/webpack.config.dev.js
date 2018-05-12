const webpack = require('webpack');
const config = require('./index');
const path = require('path');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  ...baseConfig,

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer',

  devtool: 'cheap-module-eval-source-map',

  entry: [
    // `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
    'src/renderer/index.js'
  ],

  output: {
    path: config.build.outputPath,
    filename: 'bundle.js',
    publicPath: config.dev.publicPath
  },

  plugins: [
    // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
    new webpack.HotModuleReplacementPlugin(),

    // NODE_ENV should be production so that modules do not perform certain development checks
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
