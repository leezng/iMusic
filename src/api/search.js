export default {
  /**
   * 搜索
   * @param  {[type]} keywords 关键字
   * @param  {Number} limit    每页数量
   * @param  {Number} offset   页码, 首页为0
   */
  search (keywords, limit = 15, offset = 0) {
    return fetch(`/search?keywords=${keywords}&limit=${limit}&offset=${offset}`)
      .then(res => res.ok && res.json())
  }
}
