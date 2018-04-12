export default {
  // 获取歌手榜
  getTopArtists () {
    return fetch('/toplist/artist')
      .then(res => res.ok && res.json())
  }
}
