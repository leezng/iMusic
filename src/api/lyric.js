import axios from 'axios'

export default {
  // 获取歌词
  getLyric (id) {
    return axios.get(`/lyric?id=${id}`)
      .then(res => res.data)
  }
}
