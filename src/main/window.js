const { BrowserWindow, app } = require('electron');

// 缓存口
const cache = {};

// mac下是否强制退出的标识
let forceQuit = true;

// 进程通信模块中会引入该模块, 被渲染进程使用, 因此需确保为主进程才执行下面逻辑
if (process.type === 'browser' && process.platform === 'darwin') {
  app.on('before-quit', () => {
    forceQuit = true;
  });
}

/**
 * 获取指定窗口
 * @param  {[String} name 窗口名
 */
function get(name) {
  return cache[name] || BrowserWindow.getFocusedWindow();
}

/**
 * 创建窗口
 * @param  {[String} name 窗口名
 * @param  {[String} url
 * @param  {Object} options 窗口选项
 * @return {Object} 创建的窗口对象
 */
function create(name, url, options) {
  if (cache[name]) {
    const win = cache[name];
    win.show();
    return win;
  }

  let win = new BrowserWindow(options);
  cache[name] = win;
  if (process.platform === 'darwin' && name === 'main') {
    // mac下主窗口点击信号灯关闭按钮, 只隐藏
    win.on('close', (e) => {
      if (forceQuit) return;
      e.preventDefault();
      win.hide();
    });
  } else {
    // 关闭 window 后销毁窗口对象
    win.on('closed', () => {
      delete cache[name];
      win = null;
    });
  }

  win.loadURL(url);
  return win;
}

module.exports = {
  get,
  create,
};
