import axios from 'axios'
import artistsApi from './artists'
import songlistApi from './songlist'
import searchApi from './search'
import djprogramApi from './djprogram'
import userApi from './user'
import lyricApi from './lyric'

axios.defaults.withCredentials = true // 跨域request携带cookie

if (process.env.NODE_ENV === 'development') {
  // 便于webpack-proxy
  axios.defaults.baseURL = '/api'
} else if (process.env.DEMO_ENV === 'gh-pages') {
  // gh-pages使用模拟数据
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

// 支持用户配置代理请求
axios.defaults.params = {
  proxy: ''
}
// 超时时间
axios.defaults.timeout = 2000
// 超时重新请求次数
axios.defaults.retry = 2
// 超时重新请求间隙
axios.defaults.retryDelay = 2000

axios.interceptors.response.use(undefined, (err) => {
  var config = err.config
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err)

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err)
  }

  // Increase the retry count
  config.__retryCount += 1

  // Create new promise to handle exponential backoff
  var backoff = new Promise((resolve) => {
    setTimeout(resolve, config.retryDelay || 1)
  })

  // Return the promise in which recalls axios to retry the request
  return backoff.then(() => {
    config.params.proxy = axios.defaults.params.proxy
    config.url = config.url.slice(4) // 去除每次添加的前缀'/api'
    return axios(config)
  })
})

function updateRequestProxy (url = '', port = 80) {
  let proxyUrl = ''
  if (url) {
    const { origin, pathname } = new URL(url)
    proxyUrl = `${origin}:${port}${pathname}`
  }
  axios.defaults.params.proxy = proxyUrl
}

export {
  updateRequestProxy,
  artistsApi,
  songlistApi,
  searchApi,
  djprogramApi,
  userApi,
  lyricApi
}
