const playlist = (state = {}, action) => {
  if (action.type === 'GET_SONGLIST') {
    return {
      status: action.status,
      result: action.result
    }
  } else if (action.type === 'GET_SONGLIST_DETAIL') {
    return Object.assign({}, state, {
      status: action.status,
      result: state.result.map(item => {
        if (item.id === action.id) item.detail = action.detail
        return item
      })
    })
  }
  return state
}

export default playlist
