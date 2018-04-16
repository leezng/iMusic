import axios from 'axios'

export default {
  // 获取推荐歌单
  getSonglist () {
    return axios.get('/personalized')
      .then(res => res.data)
  },
  // 获取歌单详情
  getSonglistDetail (id) {
    return axios.get(`/playlist/detail?id=${id}`)
      .then(res => res.data)
  }
}
