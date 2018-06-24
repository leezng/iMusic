const webpack = require('webpack');
const config = require('./index');
const baseConfig = require('./webpack.config.base');

module.exports = {
  ...baseConfig,

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-main',

  devtool: false,

  entry: [
    'src/main/index.js',
  ],

  output: {
    path: config.build.outputPath,
    filename: 'main.js',
    publicPath: config.build.publicPath
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),

    // NODE_ENV should be production so that modules do not perform certain development checks
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV === 'development'
        ? config.dev.env
        : config.build.env
    })
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  }
};
