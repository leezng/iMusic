import preferences from './preferences'
import call from './call'

// 需要绑定监听的函数,
//    左为事件名, 右为函数名
//    注意凡是暴露为进程通信监听的函数, 都只能有一个接收参数
const mapEvents = {
  'get-preferences': preferences.getPreferences,
  'set-preferences': preferences.setPreferences
}

// 初始化监听
//    将mapEvents中的事件绑定到主进程的监听中
function listen () {
  Object.keys(mapEvents).forEach(eventName => {
    const func = mapEvents[eventName]
    if (!eventName || typeof func !== 'function') throw new Error('unexpected function, found in ', func)
    call.mainOn(eventName, func)
  })
}

export default {
  listen
}
