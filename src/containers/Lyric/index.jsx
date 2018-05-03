import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'
// import json from 'src/lyric'
import PropTypes from 'prop-types'
import { lyricApi } from 'src/api'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  playing: state.playing
})

class App extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    running: PropTypes.bool,
    onClose: PropTypes.func,
    currentTime: PropTypes.string
  }

  static defaultProps = {
    visible: false, // 歌词界面是否可见
    running: false, // 播放|暂停
    onClose: () => {}, // 界面关闭
    currentTime: '' // 当前的播放时间
  }

  state = {
    ok: false,
    fetching: false, // 是否正在获取歌词
    lyricArr: [], // 当前歌曲的歌词
    lyricMap: {}, // 类似于lyricArr, 此数据为对象, 便于数据查找
    activeIndex: 0 // 匹配的单句歌词索引
  }

  componentDidMount () {
    window.ly = this
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible !== this.props.visible) {
      setTimeout(() => this.setState({ok: nextProps.visible}), 0)
    }
    this.watchPlaying(nextProps.playing, this.props.playing)
    this.watchCurrentTime(nextProps.currentTime, this.props.currentTime)
  }

  /**
   * 监听播放歌曲变化，重新设置歌词
   */
  async watchPlaying (newPlaying = {}, oldPlaying = {}) {
    // 播放歌曲变更, 则获取歌词
    if (newPlaying.id && newPlaying.id !== oldPlaying.id) {
      let lyricArr = []
      let lyricMap = {}
      try {
        this.setState({fetching: true, activeIndex: 0})
        const resBody = await lyricApi.getLyric(newPlaying.id) // get lyric
        if (resBody.code === 200) {
          const lyricStr = (resBody.lrc && resBody.lrc.lyric) || ''
          lyricArr = lyricStr.replace(/\n/g, ',')
            .split(',')
            .filter(item => item)
            .map(item => ({
              time: item.slice(1, 6),
              content: item.slice(11)
            }))
          lyricArr.forEach((item, index) => (lyricMap[item.time] = {
            content: item.content,
            index
          }))
        }
        this.setState({fetching: false, lyricArr, lyricMap})
      } catch (err) {
        console.warn(err)
        this.setState({fetching: false, lyricArr, lyricMap})
      }
    }
  }

  // 监听播放时间变化
  watchCurrentTime (newTime = '', oldTime = '') {
    if (!newTime) return
    const { index, content } = this.state.lyricMap[newTime] || {}
    if (content && index !== undefined) {
      this.setState({activeIndex: index})
    }
  }

  render () {
    const { lyricArr, activeIndex } = this.state
    const { visible, running, onClose, playing } = this.props
    if (!visible) return null // 不可见

    const album = playing.album || {} // 当前专辑
    const artist = (playing.artists && playing.artists[0]) || {}
    const coverUrl = album.picUrl || artist.picUrl || artist.img1v1Url
    return <div className="lyric" style={{transform: this.state.ok ? 'none' : ''}}>
      <div className="background" style={{backgroundImage: `url(${coverUrl})`}}></div>
      <div className="content">
        <Icon type="close" onClick={onClose} />
        <div
          className={`cover ${running ? 'is-running' : ''}`}
          style={{backgroundImage: `url(${coverUrl})`}}></div>
        <div className="wrapper">
          <div
            className="lyric-show"
            style={{transform: `translateY(${160 + -40 * activeIndex}px)`}}>
            {lyricArr.map((item, index) => <p
              key={index}
              className={activeIndex === index ? 'active' : ''}>
              {item.content}</p>)}
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(mapStateToProps)(App)
