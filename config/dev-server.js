/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */
const express = require('express');
const webpack = require('webpack');
const electron = require('electron')
const path = require('path');
const { spawn } = require('child_process');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxyMiddleware = require('http-proxy-middleware');
const _debug = require('debug');

const config = require('./index');
const webpackConfig = require('../config/webpack.config.dev');
const mainConfig = require('../config/webpack.config.electron');

// var topArtists = require('../mock/topArtists.json')
// var artist = require('../mock/artist.json')
// var playlist = require('../mock/playlist.json')
// var playlistDetail = require('../mock/playlistDetail.json')
// var search = require('../mock/search.json')

const debug = _debug('dev:server');
const app = express();
const proxyTable = config.dev.proxyTable || {};
const compiler = webpack(webpackConfig);

function startElectron () {
  const electronProcess = spawn(electron, [path.join(__dirname, '../dist/main.js')]);

  electronProcess.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  electronProcess.stderr.on('data', function (data) {
    console.error(data.toString());
  });

  electronProcess.on('close', () => {
    process.exit();
  });
}

const mainCompiler = webpack(mainConfig);
mainCompiler.run((err, stats) => {
  startElectron();
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  })
);
app.use(webpackHotMiddleware(compiler));
// app.get('/top/artists', async (req, res) => {
//   await wait(300)
//   return res.json(topArtists)
// })
// app.get('/artist', async (req, res) => {
//   await wait(300)
//   return res.json(artist)
// })
// app.get('/personalized', async (req, res) => {
//   await wait(300)
//   return res.json(playlist)
// })
// app.get('/playlist/detail', async (req, res) => {
//   await wait(300)
//   return req.query && req.query.id && res.json(playlistDetail)
// })
// app.get('/search', async (req, res) => {
//   await wait(300)
//   return res.json(search)
// })
app.listen(config.dev.devServer.port, config.dev.devServer.host, err => {
  if (err) {
    throw err;
  }

  debug(`Hot reload server is running with port ${config.dev.devServer.port}`);
});