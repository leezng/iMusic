export default {
  // 获取歌手榜(TOP30)
  getTopArtists () {
    return fetch('/top/artists?offset=0&limit=30')
      .then(res => res.ok && res.json())
  },
  // 获取歌手部分信息和热门歌曲
  getArtistDetail (id) {
    return fetch(`/artists?id=${id}`)
      .then(res => res.ok && res.json())
  }
}
