import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

if (process.env.NODE_ENV === 'development') {
  // 开发模式下更改用户数据目录
  app.setPath('userData', path.resolve(app.getPath('appData'), './iMusic-dev'))
}

// 未登录ID为global
const LOCAL_USER_ID = 'global'

// 记录当前用户
let user = {
  // 用户ID
  id: LOCAL_USER_ID,
  // 用户目录路径
  path: '',
  // 用户配置数据
  config: {}
}

/**
 * 确保用户目录存在
 * @param  {String} id 用户ID, 未登录时为global
 * @return {String} 用户目录文件夹
 */
function ensureUserPath (id = LOCAL_USER_ID) {
  const userPath = path.join(app.getPath('userData'), `./user/${id}`)
  try {
    fs.accessSync(userPath, fs.F_OK)
  } catch (err) {
    mkdir(userPath)
  }
  return userPath
}

/**
 * 写入用户配置信息, 保存在本地目录
 * @param  {Object} data   用户配置
 */
function setUserConfig (data) {
  user.config = data
  writeFile(path.join(user.path, './config.json'), data)
}

/**
 * 同步创建目录, 支持多层级
 * @param  {String} dirname 目录路径
 * @return {Boolean}        创建是否成功
 */
function mkdir (dirname) {
  try {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (mkdir(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  } catch (err) {
    console.error('create dir failed', err)
    return false
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
    console.warn('user config not exist', err)
  }
}

/**
 * 监听登录用户是否变化
 *   若不传ID, 表示没有登录用户, 则自动获取全局本地用户
 */
function updateUser (id) {
  if (newId === user.id) return user
  const newId = id || LOCAL_USER_ID
  const userPath = ensureUserPath(newId)
  const userConfigFile = path.join(userPath, './config.json')
  user = {
    id: newId,
    path: userPath,
    config: readFile(userConfigFile) || {}
  }
  return user
}

/**
 * 监听用户配置数据是否更新
 * @param  {Object} config 配置数据
 */
function updateUserConfig (config) {
  // 一定时间后才进行写入操作, 避免频繁IO
  if (updateUserConfig.timer) clearTimeout(updateUserConfig.timer)
  updateUserConfig.timer = setTimeout(() => {
    setUserConfig(config)
  }, 1000)
}

export default {
  get userConfig () {
    return user.config
  },
  ensureUserPath,
  updateUser,
  updateUserConfig
}
