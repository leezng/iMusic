import {
  artistsApi,
  songlistApi,
  searchApi,
  djprogramApi,
  userApi
} from 'renderer/api'

// 手机登陆
export const phoneLogin = (phone, password) => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    const user = getState().user
    if (user && user.status === 'pending') reject(new Error('pending'))

    dispatch({
      type: 'SET_USER',
      status: 'pending'
    })
    try {
      const resBody = await userApi.phoneLogin(phone, password) || {}
      if (resBody.code === 200) {
        const config = await userApi.getUserConfig(resBody.profile.userId)
        dispatch({
          type: 'SET_USER',
          status: 'resolve',
          isLocal: false,
          // account: resBody.account,暂时无需使用
          profile: resBody.profile,
          config
        })
      } else {
        dispatch({
          type: 'SET_USER',
          status: 'reject'
        })
      }
      resolve(resBody)
    } catch (err) {
      console.warn('phoneLogin error: ', err)
      dispatch({
        type: 'SET_USER',
        status: 'error'
      })
      reject(new Error('error'))
    }
  })
}

// 刷新当前的登陆状态
export const refreshLogin = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'SET_USER',
      status: 'pending'
    })
    const resBody = await userApi.refreshLogin()
    dispatch({
      type: 'SET_USER',
      status: resBody.code === 200 ? 'resolve' : 'reject'
    })
    // 若是已登录状态, 获取用户详情
    if (resBody.code === 200) dispatch(getUserDetail(id))
  } catch (err) {
    console.warn('refreshLogin: ', err)
    dispatch({
      type: 'SET_USER',
      status: 'error'
    })
  }
}

// 获取用户详情
export const getUserDetail = id => async (dispatch, getState) => {
  const user = getState().user
  if (user && user.status === 'pending') return
  try {
    dispatch({
      type: 'SET_USER',
      status: 'pending'
    })
    const resBody = await userApi.getDetail(id) || {}
    const config = await userApi.getUserConfig(resBody.profile.userId)
    dispatch({
      type: 'SET_USER',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      profile: resBody.profile,
      isLocal: resBody.code !== 200,
      config
    })
  } catch (err) {
    console.warn('getUserDetail: ', err)
    dispatch({
      type: 'SET_USER',
      status: 'error'
    })
  }
}

// 获取用户歌单
export const getUserSonglist = id => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resBody = await userApi.getUserSonglist(id) || {}
      resBody.code === 200 && dispatch({
        type: 'SET_USER_SONGLIST',
        songlist: resBody.playlist || []
      })
      resolve(resBody)
    } catch (err) {
      console.warn('getUserSonglist: ', err)
      reject(err)
    }
  })
}

// 获取用户歌单详情
export const getUserSonglistDetail = id => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resBody = await songlistApi.getSonglistDetail(id)
      if (resBody.code === 200) {
        let tracks = (resBody.result && resBody.result.tracks) || []
        dispatch({
          type: 'SET_USER_SONGLIST_DETAIL',
          tracks,
          id
        })
      }
      resolve(resBody)
    } catch (err) {
      console.warn('getUserSonglistDetail: ', err)
      reject(err)
    }
  })
}

// 模拟注销
export const setLocalUser = () => (dispatch) => {
  dispatch({
    type: 'SET_USER',
    status: 'pending'
  })
  setTimeout(async () => {
    const config = await userApi.getUserConfig()
    dispatch({
      type: 'SET_LOCAL_USER',
      config
    })
  }, 500)
}

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
    dispatch({
      ...resBody.result,
      ...{
        type: 'SET_SEARCH_RESULT',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        keywords,
        pageSize,
        pageNo
      }
    })
  } catch (err) {
    console.warn('search: ', err)
    dispatch({
      type: 'SET_SEARCH_RESULT',
      status: 'error'
    })
  }
}

// 获取歌手榜
export const getTopArtists = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_TOP_ARTISTS',
        status: 'pending'
      })
      const resBody = await artistsApi.getTopArtists()
      let artists = resBody.artists || []
      dispatch({
        type: 'GET_TOP_ARTISTS',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        topArtists: artists.map(item => ({...item, ...{isTop: true}}))
      })
      resolve(resBody)
    } catch (err) {
      console.warn('getTopArtists: ', err)
      dispatch({
        type: 'GET_TOP_ARTISTS',
        status: 'error'
      })
      reject(err)
    }
  })
}

// 获取歌手详情
export const getArtistDetail = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'ADD_ARTIST_DETAIL',
      status: 'pending'
    })
    const resBody = await artistsApi.getArtistDetail(id)
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
  } catch (err) {
    console.warn('getArtistDetail: ', err)
    dispatch({
      type: 'ADD_ARTIST_DETAIL',
      status: 'error'
    })
  }
}

// 获取推荐电台
export const getDjprogram = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_DJPROGRAM',
        status: 'pending'
      })
      const resBody = await djprogramApi.getDjprogram()
      dispatch({
        type: 'GET_DJPROGRAM',
        status: resBody.code === 200 ? 'resolve' : 'reject',
        result: resBody.result || []
      })
      resolve(resBody)
    } catch (err) {
      console.warn('getDjprogram: ', err)
      dispatch({
        type: 'GET_DJPROGRAM',
        status: 'error'
      })
      reject(err)
    }
  })
}

// 获取推荐歌单
export const getSonglist = () => (dispatch, getState) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch({
        type: 'GET_SONGLIST',
        status: 'pending'
      })
      const resBody = await songlistApi.getSonglist()
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
      resolve(resBody)
    } catch (err) {
      console.warn('getSonglist: ', err)
      dispatch({
        type: 'GET_SONGLIST',
        status: 'error'
      })
      reject(err)
    }
  })
}

// 获取推荐歌单详情
export const getSonglistDetail = id => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'GET_SONGLIST_DETAIL',
      status: 'pending'
    })
    const resBody = await songlistApi.getSonglistDetail(id)
    dispatch({
      type: 'GET_SONGLIST_DETAIL',
      status: resBody.code === 200 ? 'resolve' : 'reject',
      detail: resBody.result,
      id
    })
    if (resBody.code === 200) {
      // 关键字段: id, name, album, artists, lMusic, mMusic, hMusic
      let playlist = (resBody.result && resBody.result.tracks) || []
      dispatch(setPlaylist(playlist))
      dispatch(setPlaying(playlist[0]))
    }
  } catch (err) {
    console.warn('getSonglistDetail: ', err)
    dispatch({
      type: 'GET_SONGLIST_DETAIL',
      status: 'error'
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

export const upsetPlaylist = () => ({
  type: 'UPSET_PLAYLIST'
})

export const setPlaying = (playing = {}) => ({
  type: 'SET_PLAYING',
  playing
})
