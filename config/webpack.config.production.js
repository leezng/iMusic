const path = require('path');
const webpack = require('webpack');
const config = require('./index');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const webpackConfig = {
  ...baseConfig,

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer',

  devtool: false,

  entry: [
    'src/renderer/index.js'
  ],

  output: {
    path: config.build.outputPath,
    filename: '[name].[hash].js',
    publicPath: config.build.publicPath
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
      'process.env.NODE_ENV': config.build.env
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../package.json'),
        to: config.build.outputPath
      }
    ]),

    new HtmlWebpackPlugin({
      filename: `${config.build.outputPath}/index.html`,
      template: path.resolve(__dirname, '../index.html'),
      inject: 'body',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};

if (process.env.DEMO_ENV === 'gh-pages') {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.DEMO_ENV': '"gh-pages"'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../mock'),
        to: path.resolve(__dirname, config.build.outputPath, './mock')
      }
    ])
  );
}

module.exports = webpackConfig;
