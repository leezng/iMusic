const playing = (state = {}, action) => {
  if (action.type === 'SET_PLAYING') {
    return action.playing
  }
  return state
}

export default playing
