export default {
  // 获取推荐歌单
  getSonglist () {
    return fetch('/personalized')
      .then(res => res.ok && res.json())
  },
  // getSonglist () {
  //   return fetch('/static/mock/playlist.json')
  //     .then(res => res.ok && res.json())
  // }
  // 获取歌单详情
  getSonglistDetail (id) {
    return fetch(`/playlist/detail?id=${id}`)
      .then(res => res.ok && res.json())
  }
}
