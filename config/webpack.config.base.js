const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'],
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../config'),
          path.resolve(__dirname, '../main.js'),
          path.resolve(__dirname, '../node_modules/NeteaseCloudMusicApi'),
          path.resolve(__dirname, '../node_modules/hoek')
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }]
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader'],
        include: path.resolve(__dirname, '../src'),
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
              mimetype: 'image/svg+xml'
          }
        }],
        include: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: path.resolve(__dirname, '../src'),
      config: path.resolve(__dirname, '../config')
    }
  }
};
