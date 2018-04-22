const path = require('path');
const webpack = require('webpack');
const config = require('./index');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

module.exports = {
  ...baseConfig,

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer',

  devtool: false,

  entry: [
    // 'babel-polyfill',
    'src/index.js'
  ],

  output: {
    path: config.dist,
    filename: '[name].[hash].js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),

    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // https://github.com/webpack/webpack/issues/864
    new webpack.optimize.OccurrenceOrderPlugin(),

    // NODE_ENV should be production so that modules do not perform certain development checks
    new webpack.DefinePlugin({
      DEBUG: false,
      'process.env.NODE_ENV': '"production"'
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../package.json'),
        to: config.dist
      }
    ]),

    new HtmlWebpackPlugin({
      filename: `${config.dist}/index.html`,
      template: path.resolve(__dirname, '../index.html'),
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};
