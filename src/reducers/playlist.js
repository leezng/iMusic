const playlist = (state = [], action) => {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return action.playlist
    case 'ADD_TO_PLAYLIST':
      return state.concat([action.item])
    case 'REMOVE_FROM_PLAYLIST':
      let newState = [...state]
      let index = newState.findIndex(item => item.id === action.id)
      if (index !== -1) newState.splice(index, 1)
      return newState
    case 'CLEAR_PLAYLIST':
      return []
    default:
      return state
  }
}

export default playlist
