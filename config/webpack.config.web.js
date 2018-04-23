const path = require('path');
const webpack = require('webpack');
const config = require('./index');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const folder = path.resolve(__dirname, '../dist-web')

module.exports = {
  ...baseConfig,

  devtool: false,

  entry: [
    'src/index.js'
  ],

  output: {
    path: folder,
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
        to: folder
      }, {
        from: path.resolve(__dirname, '../mock'),
        to: `${folder}/mock`,
        ignore: ['.*']
      }
    ]),

    new HtmlWebpackPlugin({
      filename: `${folder}/index.html`,
      template: path.resolve(__dirname, '../index.html'),
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};
