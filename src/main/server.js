/*eslint-disable*/
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('NeteaseCloudMusicApi/util/request');
const cache = require('NeteaseCloudMusicApi/util/apicache').middleware;
const { cookieToJson } = require('NeteaseCloudMusicApi/util/index');
const fileUpload = require('express-fileupload');
const config = require('../../config');

const app = express();

if (process.env.NODE_ENV !== 'development') {
  // server除带.的路径, 都当作http请求处理
  app.use('/', express.static(__dirname));
}

// CORS & Preflight request
app.use((req, res, next) => {
  if (req.path !== '/' && !req.path.includes('.')) {
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      'Content-Type': 'application/json; charset=utf-8',
    });
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next();
});

// cookie parser
app.use((req, res, next) => {
  req.cookies = {};
  (req.headers.cookie || '').split(/\s*;\s*/).forEach((pair) => {
    let crack = pair.indexOf('=');
    if (crack < 1 || crack == pair.length - 1) return;
    req.cookies[decodeURIComponent(pair.slice(0, crack)).trim()] = decodeURIComponent(
      pair.slice(crack + 1),
    ).trim();
  });
  next();
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

// cache
app.use(cache('2 minutes', (req, res) => res.statusCode === 200));
// router
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm',
};

const NeteaseCloudMusicApiPath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, './node_modules/NeteaseCloudMusicApi')
    : path.join(__dirname, '../../node_modules/NeteaseCloudMusicApi');

fs.readdirSync(path.join(NeteaseCloudMusicApiPath, './module'))
  .reverse()
  .forEach((file) => {
    if (!file.endsWith('.js')) return;
    const route =
      file in special ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
    const question = require(`../../node_modules/NeteaseCloudMusicApi/module/${file}`);

    app.use('/api' + route, (req, res) => {
      if (typeof req.query.cookie === 'string') {
        req.query.cookie = cookieToJson(req.query.cookie);
      }
      const query = Object.assign({}, { cookie: req.cookies }, req.query, req.body, req.files);

      question(query, request)
        .then((answer) => {
          console.log('[OK]', decodeURIComponent(req.originalUrl));
          res.append('Set-Cookie', answer.cookie);
          res.status(answer.status).send(answer.body);
        })
        .catch((answer) => {
          console.log('[ERR]', decodeURIComponent(req.originalUrl), {
            status: answer.status,
            body: answer.body,
          });
          if (answer.body.code == '301') answer.body.msg = '需要登录';
          res.append('Set-Cookie', answer.cookie);
          res.status(answer.status).send(answer.body);
        });
    });
  });

const port = config.build.port;

app.server = app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

module.exports = app;
