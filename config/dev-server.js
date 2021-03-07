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
const webpackConfig = require('../config/webpack.config.renderer');
const mainConfig = require('../config/webpack.config.electron');

// var topArtists = require('../mock/topArtists.json')
// var artist = require('../mock/artist.json')
// var playlist = require('../mock/playlist.json')
// var playlistDetail = require('../mock/playlistDetail.json')
// var search = require('../mock/search.json')

const debug = _debug('dev:server');
const app = express();
const proxyTable = config.dev.proxyTable || {};

function startElectron () {
  const electronProcess = spawn(electron, [path.join(__dirname, '../src/main/index.js')]);

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

const compiler = webpack(webpackConfig);

const wdmInstance = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

const hotMiddleware = webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 2000,
});

// force page reload when html-webpack-plugin template changes
compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
  hotMiddleware.publish({
    action: 'reload',
  });
});

// serve webpack bundle output
app.use(wdmInstance);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

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

module.exports = new Promise(resolve => {
  console.log('> Starting dev server...');
  const server = app.listen(config.dev.devServer.port, config.dev.devServer.host, err => {
    if (err) {
      throw err;
    }

    wdmInstance.waitUntilValid(() => {
      debug(`Hot reload server is running with port ${config.dev.devServer.port}`);
    });
  });;

  resolve({
    port: config.dev.devServer.port,
    close: () => {
      server.close();
    },
  });
});
