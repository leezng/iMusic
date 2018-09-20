import axios from 'axios'
import call from 'main/call'

export default {
  // 通知主进程用户更改, 并获取用户本地配置
  async getUserConfig (userId) {
    const { config } = await call.sendToMain('update-user', userId)
    return config
  },
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
