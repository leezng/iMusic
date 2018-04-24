const config = require('./config')
// const path = require('path')
const express = require('express')
const { app, BrowserWindow } = require('electron')

process.env.PORT = config.build.port // set server port

var server = require('NeteaseCloudMusicApi/app.js') // server

if (process.env.NODE_ENV !== 'development') {
  // server除带.的路径, 都当作http请求处理
  server.use('/', express.static(__dirname))
}

// let isOsx = process.platform === 'darwin'
// 保持win对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
var win

const createMainWindow = () => {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 1080,
    minWidth: 800,
    height: 660,
    minHeight: 500,
    frame: false,
    titleBarStyle: 'hiddenInset'
  })

  // 打开开发者工具，默认不打开
  // win.webContents.openDevTools()

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

// if (isOsx) {
//   // App about
//   // app.setAboutPanelOptions({
//   //     applicationName:
//   //     applicationVersion:
//   //     copyright:
//   //     credits:
//   //     version:
//   // });
//   app.dock.setIcon(`${__dirname}/resource/dock.png`)
//   // app.dock.setMenu(Menu.buildFromTemplate(dockMenu))
// }

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createMainWindow)

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  // macOS中除非用户按下 Cmd + Q 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
  if (win === null) {
    createWindow()
  }
})
