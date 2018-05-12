// 本地播放列表的存储键名
const KEY = '__playlist'
const LOCAL = getLocalStorage()

// 获取本地存锤
function getLocalStorage (key = KEY) {
  const str = localStorage.getItem(key)
  return str ? JSON.parse(str) : []
}

// 存储到本地
function setLocalStorage (value, key = KEY) {
  localStorage.setItem(key, JSON.stringify(value))
}

const playlist = (state = LOCAL, action) => {
  let result
  switch (action.type) {
    // 设置为当前的播放队列
    case 'SET_PLAYLIST':
      result = action.playlist
      break
    // 添加到播放队列
    case 'ADD_TO_PLAYLIST':
      result = state.concat([action.item])
      break
    // 从播放队列中移除
    case 'REMOVE_FROM_PLAYLIST':
      let newState = [...state]
      let index = newState.findIndex(item => item.id === action.id)
      if (index !== -1) newState.splice(index, 1)
      result = newState
      break
    // 清空播发队列
    case 'CLEAR_PLAYLIST':
      result = []
      break
    // 打乱队列顺序
    case 'UPSET_PLAYLIST':
      result = [...state].sort((a, b) => Math.random() - 0.5)
      break
    default:
      result = state
  }
  if (setLocalStorage.timer) clearTimeout(setLocalStorage.timer)
  setLocalStorage.timer = setTimeout(() => {
    setLocalStorage(result) // 更新本地存储
  }, 500)
  return result
}

export default playlist
