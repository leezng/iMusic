import config from '../../config'
import express from 'express'
import { app, BrowserWindow, session } from 'electron'
import server from 'NeteaseCloudMusicApi/app.js'
import window from './window'
import message from './message'
import preferences from './preferences'
import menu from './menu'

if (process.env.NODE_ENV !== 'development') {
  // server除带.的路径, 都当作http请求处理
  server.use('/', express.static(__dirname))
}

// 创建主窗口
function createWindow () {
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:${config.dev.devServer.port}`
    : `http://localhost:${config.build.port}`

  const win = window.create('main', url, {
    width: 960,
    minWidth: 800,
    height: 600,
    minHeight: 500,
    frame: false,
    show: false,
    titleBarStyle: 'hiddenInset'
  })

  win.once('ready-to-show', () => {
    // 显示主窗口
    win.show()
    // 开发模式下打开调试工具
    if (process.env.NODE_ENV === 'development') win.webContents.openDevTools()
  })
}

function handleCookie () {
  session.defaultSession.cookies.on('changed', (e, cookie, cause, removed) => {
    console.log('cookieChanged: ', cookie, cause, removed)
    session.defaultSession.cookies.flushStore(() => {
      console.log('cookies.flushStore is ok!')
    })
  })
}

// 入口
app.on('ready', () => {
  // 第一顺序: 创建窗口
  createWindow()
  // cookies监听并保存到本地
  handleCookie()
  // 绑定主进程监听事件
  message.listen()
  // 创建偏好设置相关文件
  preferences.init()
})

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // mac 中除了显式退出, 应用与菜单栏始终处于活动状态
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', createWindow)
