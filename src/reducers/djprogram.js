const playing = (state = {}, action) => {
  if (action.type === 'GET_DJPROGRAM') {
    return {
      status: action.status,
      result: action.result
    }
  }
  return state
}

export default playing
