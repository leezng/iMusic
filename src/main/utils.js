/**
 * 确保指定目录存在
 * @param  {String} filePath 需创建的目录相对路径
 * @return {String} 绝对路径
 */
function ensurePath (filePath) {
  const userPath = path.join(app.getPath('userData'), filePath)
  try {
    fs.accessSync(userPath, fs.F_OK)
  } catch (err) {
    mkdir(userPath)
  }
  return userPath
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
