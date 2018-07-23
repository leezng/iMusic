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
 * 同步创建目录
 * @param  {String} dirname 目录路径
 * @return {Boolean}        创建是否成功
 */
function mkdirsSync (dirname) {
  try {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  } catch (err) {
    console.error('创建目录失败', err)
    return false
  }
}

/**
 * 确保用户目录存在
 * @param  {String} id 用户ID, 未登录时为global
 */
function ensureUserDir (id) {
  const pa = path.join(app.getPath('userData'), `./user/${id}`)
  try {
    fs.accessSync(pa, fs.F_OK)
  } catch (err) {
    mkdirsSync(pa)
  }
  // return pa

  try {
    const file = path.join(pa, './config.json')
    // fs.readFile(file, (err, data) => {
    //   if (!err) {
    //     let obj = data ? JSON.parse(data.toString()) : {}
    //     obj.proxy = 'http://proxy'
    //     let buffer = Buffer.from(JSON.stringify(obj))
    //     fs.writeFileSync(file, buffer)
    //   } else {
    //     fs.writeFileSync(file, Buffer.from(JSON.stringify({})))
    //   }
    // })
  } catch (err) {
    console.log('写入出错', err)
  }
  return pa
}

function updateUserConfig (key, value) {
  try {
    const file = path.join(user.path, './config.json')
    const result = fs.readFileSync(file)
    // file已存在, 则更新file
    let obj = JSON.parse(result.toString())
    obj.proxy = 'http://proxy'
    const buffer = Buffer.from(JSON.stringify(obj))
    fs.writeFileSync(file, buffer)
  } catch (err) {

  }
}

function writeFile (file, data) {
  // file不存在
  try {
    const buffer = Buffer.from(JSON.stringify(data))
    fs.writeFileSync(file, buffer)
  } catch (err) {
    console.log('failed to write in new file', err)
  }
}

function readFile (path) {
  try {
    const buffer = Buffer.from(JSON.stringify(data))
    fs.writeFileSync(file, buffer)
  } catch (err) {
    console.warn('user config not exist')
    return {}
  }
}

ipcMain.on('set-user', (event, id) => {
  const userId = id || LOCAL_USER_ID
  if (userId === user.id) return
  const userPath = ensureUserDir(userId)
  user = {
    id: userId,
    path: userPath
    config: readFileSync(path.join(userPath, './config.json'))
  }
})

export default {
  get userId () {
    return user.id
  }
}
