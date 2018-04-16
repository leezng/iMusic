import axios from 'axios'

export default {
  // 获取歌手榜(TOP30)
  getTopArtists () {
    return axios.get('/top/artists?offset=0&limit=30')
      .then(res => res.data)
  },
  // 获取歌手部分信息和热门歌曲
  getArtistDetail (id) {
    return axios.get(`/artists?id=${id}`)
      .then(res => res.data)
  }
}
