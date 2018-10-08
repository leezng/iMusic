import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

if (process.env.NODE_ENV === 'development') {
  // 开发模式下更改用户数据目录
  app.setPath('userData', path.resolve(app.getPath('appData'), './iMusic-dev'))
}

// 当前配置
const preferences = {
  path: path.join(app.getPath('userData'), `./App.Preferences`),
  data: {}
}

// 初始化本地配置与文件
function init () {
  const data = readFile(preferences.path)
  if (data) {
    preferences.data = data
  } else {
    writeFile(preferences.path, {})
  }
}

/**
 * 写入文件
 * @param  {String} file 文件路径
 * @param  {Object|String} data 写入的内容
 * @param  {Boolean} append 是否为追加模式, 默认false为覆盖原文件
 */
function writeFile (file, data, append = false, encoding = 'utf8') {
  try {
    const buffer = Buffer.from(JSON.stringify(data))
    fs.writeFileSync(file, buffer, {
      encoding,
      flag: append ? 'a' : 'w'
    })
  } catch (err) {
    console.log('write file failed', err)
  }
}

/**
 * 读取文件
 * @param  {String} file 文件路径
 * @return {Object|String|Undefined}
 */
function readFile (file) {
  try {
    const result = fs.readFileSync(file)
    return JSON.parse(result.toString())
  } catch (err) {
    console.warn('file is not exist', err)
  }
}

/**
 * 接口: 获取配置数据
 */
function getPreferences () {
  return preferences.data
}

/**
 * 接口: 监听配置数据更新
 * @param  {Object} data 配置数据
 */
function setPreferences (data) {
  // 一定时间后才进行写入操作, 避免频繁IO
  if (setPreferences.timer) clearTimeout(setPreferences.timer)
  setPreferences.timer = setTimeout(() => {
    preferences.data = data
    writeFile(preferences.path, data)
  }, 1000)
}

export default {
  init,
  getPreferences,
  setPreferences
}
