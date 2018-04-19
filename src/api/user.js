import axios from 'axios'

export default {
  // 手机登陆
  phoneLogin (phone, password) {
    return axios.get(`/login/cellphone?phone=${phone}&password=${password}`)
      .then(res => res.data)
  },
  // 获取用户详情
  getDetail (id) {
    return axios.get(`/user/detail?uid=${id}`)
      .then(res => res.data)
  },
  // 刷新登陆
  refreshLogin () {
    return axios.get('/login/refresh')
      .then(res => res.data)
  },
  // 获取用户歌单
  getUserSonglist (id) {
    return axios.get(`/user/playlist?uid=${id}`)
      .then(res => res.data)
  }
}
