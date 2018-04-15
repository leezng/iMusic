const port = 11845 // 服务器使用端口
// SERVER_ENV = development | production
const isDev = process.env.SERVER_ENV === 'development'

process.env.PORT = port

// 引入electron并创建一个Browserwindow
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const express = require('express')
const server = require('NeteaseCloudMusicApi/app.js')

if (!isDev) {
  // server除带.的路径, 都当作http请求处理
  server.use('/.app', express.static(path.resolve(__dirname, './build')))
}

// 保持win对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
var win

function createWindow () {
  const homePage = isDev
    ? 'http://localhost:8086/'
    : 'http://localhost:' + port + '/.app/'
  // 创建浏览器窗口
  win = new BrowserWindow({ width: 1080, height: 660, frame: false, titleBarStyle: 'hiddenInset' })
  win.show()
  // 此处应判断：打包时进入该注释部分
  // 加载应用-----  electron-quick-start中默认的加载入口
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, './build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  
  // 加载应用
  win.loadURL(homePage)
  
  // 打开开发者工具，默认不打开
  // win.webContents.openDevTools()

  // 关闭window时触发下列事件.
  win.on('closed', function () {
    win = null
  })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createWindow)

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
