/**
 * 进程通信模块
 */
import { ipcMain, ipcRenderer } from 'electron'
import window from './window'

let id = 0

/**
 * 发消息
 * @param  {String}  event  消息名
 * @param  {All}  args   参数
 * @param  {Boolean} isMain 发送主体, 默认是主进程, 即发往渲染进程
 * @return {Promise}
 */
function send (event, args, isMain = true) {
  const win = isMain ? window.get('main').webContents : ipcRenderer
  return new Promise((resolve, reject) => {
    const eventId = `${++id}`
    win.send(event, eventId, args)
    win.on(eventId, (e, res) => {
      resolve(res)
    })
  })
}

/**
 * 收消息
 * @param  {String}  event  消息名
 * @param  {Number}  id   需回复的事件ID
 * @param  {All}  args   参数
 * @param  {function} callback 收到消息后的执行回调
 * @param  {Boolean} isMain 发送主体, 默认是主进程, 即发往渲染进程
 */
function on (event, callback, isMain = true) {
  const win = isMain ? ipcMain : ipcRenderer
  win.on(event, (e, id, args) => {
    const result = callback(args) || 'ok'
    e.sender.send(id, result)
  })
}

// 发消息: 渲染进程 -> 主进程
function sendToMain (event, args) {
  return send(event, args, false)
}

// 发消息: 主进程 -> 渲染进程
function sendToRenderer (event, args) {
  return send(event, args)
}

// 主进程接收消息
function mainOn (event, callback) {
  return on(event, callback)
}

// 渲染进程接收消息
function rendererOn (event, callback) {
  return on(event, callback, false)
}

export default {
  mainOn,
  rendererOn,
  sendToMain,
  sendToRenderer
}
