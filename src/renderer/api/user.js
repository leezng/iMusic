import axios from 'axios'

export default {
  // 手机登陆
  phoneLogin (phone, password) {
    return axios.get(`/login/cellphone?phone=${phone}&password=${password}`)
      .then(res => res.data)
  },
  // 获取用户详情
  getDetail (userId) {
    return axios.get(`/user/detail?uid=${userId}`)
      .then(res => res.data)
  },
  // 刷新登陆
  refreshLogin () {
    return axios.get('/login/refresh')
      .then(res => res.data)
  },
  // 获取用户歌单
  getUserSonglist (userId) {
    return axios.get(`/user/playlist?uid=${userId}`)
      .then(res => res.data)
  },
  // 获取用户播放记录
  // type=1 时只返回 weekData, type=0 时返回 allData
  getUserRecord (userId) {
    return axios.get(`/user/record?uid=${userId}&type=1`)
      .then(res => res.data)
  }
}
