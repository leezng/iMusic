export default {
  // 获取推荐电台
  getDjprogram () {
    return fetch('/personalized/djprogram')
      .then(res => res.ok && res.json())
  }
}
