/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const proxyMiddleware = require('http-proxy-middleware')
const _debug = require('debug')

const config = require('./index')
const webpackConfig = require('../config/webpack.config.dev')

// var topArtists = require('../mock/topArtists.json')
// var artist = require('../mock/artist.json')
// var playlist = require('../mock/playlist.json')
// var playlistDetail = require('../mock/playlistDetail.json')
// var search = require('../mock/search.json')

const debug = _debug('dev:server')
const app = express()
const compiler = webpack(webpackConfig)
const proxyTable = config.proxyTable || {}

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  })
)
app.use(webpackHotMiddleware(compiler))
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
app.listen(config.devServer.port, config.devServer.host, err => {
  if (err) {
    throw err
  }

  debug(`Hot reload server is running with port ${config.devServer.port}`)
})