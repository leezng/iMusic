const config = require('../../config')
const express = require('express')
const { app, BrowserWindow, session } = require('electron')

process.env.PORT = config.build.port // set server port

const server = require('NeteaseCloudMusicApi/app.js') // server

if (process.env.NODE_ENV !== 'development') {
  // server除带.的路径, 都当作http请求处理
  server.use('/', express.static(__dirname))
}

// 保持win对象的全局引用, 避免JavaScript对象被垃圾回收时, 窗口被自动关闭
var win

function createWindow () {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 960,
    minWidth: 800,
    height: 600,
    minHeight: 500,
    frame: false,
    titleBarStyle: 'hiddenInset'
  })

  // 开发模式下打开调试工具
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  // 关闭window时触发下列事件.
  win.on('closed', function () {
    win = null
  })

  // 加载应用
  win.loadURL(
    process.env.NODE_ENV === 'development'
      ? `http://localhost:${config.dev.devServer.port}`
      : `http://localhost:${config.build.port}`
  )

  win.webContents.on('did-finish-load', () => {
    try {
      win.show()
    } catch (ex) { }
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
app.on('ready', function () {
  createWindow()
  handleCookie()
})

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  // macOS中除非用户按下 Cmd + Q 显式退出, 否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时, 则在应用中重建一个窗口
  if (win === null) {
    createWindow()
  }
})
