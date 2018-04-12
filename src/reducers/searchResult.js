const searchResult = (state = {}, action) => {
  if (action.type === 'SET_SEARCH_RESULT') {
    let result = {...state, ...action}
    delete result.type
    if (state.keywords === action.keywords && state.songs && result.songs) {
      let songs = [...state.songs]
      let pageSize = action.pageSize
      let index = action.pageNo * pageSize
      while (pageSize) {
        let data = result.songs[pageSize - 1]
        if (data) songs[index + pageSize - 1] = data
        pageSize--
      }
      result.songs = songs
    }
    
    return result
  }
  return state
}

export default searchResult
