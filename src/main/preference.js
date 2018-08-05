import { app, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'

// 未登录ID为global
const LOCAL_USER_ID = 'global'

// 记录当前用户
let user = {
  // 用户ID
  id: LOCAL_USER_ID,
  // 用户目录路径
  path: ensureUserDir(LOCAL_USER_ID),
  config: {}
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
 * 确保用户目录存在
 * @param  {String} id 用户ID, 未登录时为global
 * @return {String} 用户目录文件夹
 */
function ensureUserDir (id) {
  const userPath = path.join(app.getPath('userData'), `./user/${id}`)
  try {
    fs.accessSync(pa, fs.F_OK)
  } catch (err) {
    mkdir(pa)
  }
  return userPath
}

function updateUserConfig (key, value) {
  const file = path.join(user.path, './config.json')
  const result = readFile(file) || {}
  obj[key] = value
  writeFile(file, obj)
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
      flag
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
 */
ipcMain.on('set-user', (event, id) => {
  const userId = id || LOCAL_USER_ID
  if (userId === user.id) return
  const userPath = ensureUserDir(userId)
  const userConfigFile = path.join(userPath, './config.json')
  user = {
    id: userId,
    path: userPath
    config: readFile(userConfigFile) || {}
  }
})

export default {
  get userId () {
    return user.id
  }
}
