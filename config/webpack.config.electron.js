const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./index');
const baseConfig = require('./webpack.config.base');

const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-main',

  devtool: isProd ? false : 'eval-cheap-module-source-map',

  entry: ['src/main/index.js'],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: isProd ? config.build.publicPath : config.dev.publicPath,
  },

  plugins: [
    new webpack.DefinePlugin({
      DEBUG: !isProd,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false,
  },
});

// if (isProd) {
//   webpackConfig.plugins.push(
//     new CopyWebpackPlugin({
//       patterns: [
//         {
//           from: path.resolve(__dirname, '../node_modules/NeteaseCloudMusicApi'),
//           to: path.resolve(__dirname, '../dist/NeteaseCloudMusicApi'),
//         },
//       ],
//     }),
//   );
// }

module.exports = webpackConfig;
