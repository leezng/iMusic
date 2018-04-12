const topArtists = (state = {}, action) => {
  if (action.type === 'GET_TOP_ARTISTS') {
    return {
      status: action.status,
      result: action.result
    }
  }
  return state
}

export default topArtists
