// 本地用户
const local = {
  name: 'LOCAL',
  isLocal: true
}

const user = (state = local, action) => {
  if (action.type === 'SET_USER') {
    return action.user
  }
  return state
}

export default user
