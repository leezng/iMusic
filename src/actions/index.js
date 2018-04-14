import {
  artistsApi,
  songlistApi,
  searchApi
} from 'src/api'

// 搜索
export const search = (keywords, pageSize, pageNo) => async (dispatch, getState) => {
  const searchResult = getState().searchResult
  if (searchResult && searchResult.status === 'pending') return
  try {
    dispatch({
      type: 'SET_SEARCH_RESULT',
      status: 'pending'
    })
    const resBody = await searchApi.search(keywords, pageSize, pageNo)
    dispatch({...resBody.result, ...{
      type: 'SET_SEARCH_RESULT',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      keywords,
      pageSize,
      pageNo
    }})
  } catch (err) {
    console.warn('search: ', err)
    dispatch({
      type: 'SET_SEARCH_RESULT',
      status: 'reject'
    })
  }
}

// 获取歌手榜
export const getTopArtists = () => async (dispatch, getState) => {
  const artists = getState().artists
  if (artists && artists.status === 'pending') return
  try {
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: 'pending'
    })
    const resBody = await artistsApi.getTopArtists()
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      topArtists: resBody.artists.map(item => ({...item, ...{isTop: true}}))
    })
  } catch (err) {
    console.warn('getTopArtists: ', err)
    dispatch({
      type: 'GET_TOP_ARTISTS',
      status: 'reject'
    })
  }
}

// 获取歌手详情
export const getArtistDetail = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'ADD_ARTIST_DETAIL',
      status: 'pending'
    })
    const resBody = await artistsApi.getArtistDetail(id)
    if (resBody.code === 200) {
      let artist = resBody.artist || {}
      dispatch({
        type: 'ADD_ARTIST_DETAIL',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        detail: {
          desc: artist.briefDesc,
          hotSongs: resBody.hotSongs || []
        },
        id
      })
    }
  } catch (err) {
    console.warn('getArtistDetail: ', err)
    dispatch({
      type: 'ADD_ARTIST_DETAIL',
      status: 'reject'
    })
  }
}

// 获取推荐歌单
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
    console.warn('getSonglist: ', err)
    dispatch({
      type: 'GET_SONGLIST',
      status: 'reject'
    })
  }
}

// 获取推荐歌单详情
export const getSonglistDetail = id => async (dispatch, getState) => {
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
      // 关键字段: id, name, album, artists, lMusic, mMusic, hMusic
      let playlist = (resBody.result && resBody.result.tracks) || []
      dispatch(setPlaylist(playlist))
      dispatch(setPlaying(playlist[0]))
    }
  } catch (err) {
    console.warn('getSonglistDetail: ', err)
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
