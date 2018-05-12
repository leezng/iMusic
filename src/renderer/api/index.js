import axios from 'axios'
import artistsApi from './artists'
import songlistApi from './songlist'
import searchApi from './search'
import djprogramApi from './djprogram'
import userApi from './user'
import lyricApi from './lyric'

axios.defaults.withCredentials = true // 携带cookie

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api' // 便于代理
} else if (process.env.DEMO_ENV === 'gh-pages') {
  axios.interceptors.request.use((config) => {
    if (!config.url) return config
    let end = config.url.indexOf('?')
    if (end === -1) end = config.url.length
    let name = config.url
      .slice(1, end)
      .replace(/\/(\w+)/g, ($0, $1) => $1[0].toUpperCase() + $1.slice(1)) + '.json'
    return {
      ...config,
      ...{
        url: location.origin + location.pathname + '/mock/' + name
      }
    }
  })
}

export {
  artistsApi,
  songlistApi,
  searchApi,
  djprogramApi,
  userApi,
  lyricApi
}
