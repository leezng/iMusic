import axios from 'axios'

export default {
  // 获取推荐电台
  getDjprogram () {
    return axios.get('/personalized/djprogram')
      .then(res => res.data)
  }
}
