const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const config = require('./index');
const baseConfig = require('./webpack.config.base');

const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = merge(baseConfig, {
  mode: isProd ? 'production' : 'development',

  target: 'electron-renderer',

  devtool: isProd ? false : 'eval-cheap-module-source-map',

  entry: [
    // hot reload
    ...(isProd ? [] : ['webpack-hot-middleware/client?path=/__webpack_hmr']),
    // app
    'src/renderer/index.tsx',
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isProd ? '[name].[hash].js' : '[name].js',
    publicPath: isProd ? config.build.publicPath : config.dev.publicPath,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minChunks: 5,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: -1,
          reuseExistingChunk: true,
        },
        styles: {
          chunks: 'all',
          test: /\.(css|less)$/,
          name: 'styles',
          enforce: true,
          priority: -4,
        },
        commons: {
          chunks: 'initial',
          minChunks: 3,
          name: 'syncs',
          maxInitialRequests: 5,
          minSize: 1024,
          priority: -5,
          reuseExistingChunk: true,
        },
        asyncs: {
          chunks: 'async',
          minChunks: 2,
          name: 'asyncs',
          maxInitialRequests: 1,
          minSize: 0,
          priority: -6,
          reuseExistingChunk: true,
        },
      },
    },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      DEBUG: !isProd,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
      inject: true,
      minify: {
        collapseWhitespace: true,
      },
    }),

    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[name].[chunkhash].css',
          }),
          new OptimizeCssAssetsWebpackPlugin(),
        ]
      : []),
  ],
});

if (process.env.DEMO_ENV === 'gh-pages') {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.DEMO_ENV': '"gh-pages"',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../mock'),
          to: path.resolve(__dirname, '../dist', './mock'),
        },
      ],
    }),
  );
}

if (isProd) {
  webpackConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../package.json'),
          to: path.resolve(__dirname, '../dist'),
        },
      ],
    }),
  );
}

module.exports = webpackConfig;
