import config from '../../config'
import express from 'express'
import { app, BrowserWindow, session } from 'electron'
import server from 'NeteaseCloudMusicApi/app.js'
import message from './message'
import preferences from './preferences'

if (process.env.NODE_ENV !== 'development') {
  // server除带.的路径, 都当作http请求处理
  server.use('/', express.static(__dirname))
}

var win // 缓存窗口对象
var forceQuit // mac下是否强制退出的标识

if (process.platform === 'darwin') {
  app.on('before-quit', function () {
    forceQuit = true
  })
}

function createWindow () {
  if (win) {
    win.show()
    return
  }

  message.listen()
  preferences.init()

  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 960,
    minWidth: 800,
    height: 600,
    minHeight: 500,
    frame: false,
    show: false,
    titleBarStyle: 'hiddenInset'
  })

  if (process.platform !== 'darwin') {
    // 关闭 window 后销毁窗口对象
    win.on('closed', () => {
      win = null
    })
  } else {
    win.on('close', e => {
      if (forceQuit) return
      e.preventDefault()
      win.hide()
    })
  }

  // 加载应用
  win.loadURL(
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${config.dev.devServer.port}`
      : `http://localhost:${config.build.port}`
  )

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

// Electron 完成初始化
app.on('ready', () => {
  createWindow()
  handleCookie()
})

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  // mac 中除了显式退出, 应用与菜单栏始终处于活动状态
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', createWindow)
