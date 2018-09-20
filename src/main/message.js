import users from './user'
import call from './call'

// 将大小驼峰改为连字符写法
function splitName (name) {
  return name.replace(/[A-Z]/g, str => `-${str.toLowerCase()}`)
}

// 需要绑定监听的函数,
//    左为事件名, 右为函数名
const mapEvents = {
  'update-user': users.updateUser,
  'update-user-config': users.updateUserConfig
}

// 将mapEvents中的事件绑定到主进程的监听中
//    注意凡是暴露为进程通信监听的函数, 都只能有一个接收参数
Object.keys(mapEvents).forEach(eventName => {
  const func = mapEvents[eventName]
  if (!eventName || typeof func !== 'function') throw new Error('unexpected function, found in ', func)
  call.mainOn(eventName, func)
})
