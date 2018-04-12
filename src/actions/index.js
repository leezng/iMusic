import {
  topArtistsApi,
  songlistApi,
  searchApi
} from 'src/api'

export const search = (keywords, pageSize, pageNo) => async (dispatch, getState) => {
  const searchResult = getState().searchResult
  if (searchResult && searchResult.status === 'pending') return
  try {
    dispatch({
      type: 'SET_SEARCH_RESULT',
      status: 'pending'
    })
    const resBody = await searchApi.search(keywords)
    dispatch({...resBody.result, ...{
      type: 'SET_SEARCH_RESULT',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      keywords,
      pageSize,
      pageNo
    }})
  } catch (err) {
    console.log('search: ', err)
    dispatch({
      type: 'SET_SEARCH_RESULT',
      status: 'reject'
    })
  }
}

export const getTopArtists = () => async (dispatch, getState) => {
  const topArtists = getState().topArtists
  if (topArtists && topArtists.status === 'pending') return
  try {
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: 'pending'
    })
    const resBody = await topArtistsApi.getTopArtists()
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      result: resBody.list && resBody.list.artists
    })
  } catch (err) {
    console.log('getTopArtists: ', err)
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: 'reject'
    })
  }
}

export const getSonglist = () => async (dispatch, getState) => {
  const songlist = getState().songlist
  if (songlist && songlist.status === 'pending') return
  try {
    dispatch({
      type: 'GET_SONGLIST',
      status: 'pending'
    })
    const resBody = await songlistApi.getSonglist()
    if (resBody.code === 200) {
      let result = resBody.result || []
      dispatch({
        type: 'GET_SONGLIST',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        result: result.map(item => ({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl
        }))
      })
    }
  } catch (err) {
    console.log('getSonglist: ', err)
    dispatch({
      type: 'GET_SONGLIST',
      status: 'reject'
    })
  }
}

export const getSonglistDetail = id => async (dispatch, getState) => {
  const songlistDetail = getState().songlistDetail
  if (songlistDetail && songlistDetail.status === 'pending') return
  try {
    dispatch({
      type: 'GET_SONGLIST_DETAIL',
      status: 'pending'
    })
    const resBody = await songlistApi.getSonglistDetail(id)
    if (resBody.code === 200) {
      dispatch({
        type: 'GET_SONGLIST_DETAIL',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        detail: resBody.result,
        id
      })
      let playlist = (resBody.result && resBody.result.tracks) || []
      dispatch(setPlaylist(playlist))
      dispatch(setPlaying(playlist[0]))
    }
  } catch (err) {
    console.log('getSonglistDetail: ', err)
    dispatch({
      type: 'GET_SONGLIST_DETAIL',
      status: 'reject'
    })
  }
}

export const setPlaylist = (playlist = []) => ({
  type: 'SET_PLAYLIST',
  playlist
})

export const addToPlaylist = (item = {}) => ({
  type: 'ADD_TO_PLAYLIST',
  item
})

export const removeFromPlaylist = id => ({
  type: 'REMOVE_FROM_PLAYLIST',
  id
})

export const clearPlaylist = () => ({
  type: 'CLEAR_PLAYLIST'
})

export const setPlaying = (playing = {}) => ({
  type: 'SET_PLAYING',
  playing
})
