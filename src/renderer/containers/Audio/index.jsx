import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon, Tooltip, Divider, message } from 'antd'
import Lyric from '../Lyric'
import { setPlaying } from 'renderer/actions'
import './index.less'

// 时间一位数时加0
function pad (val) {
  val = Math.floor(val) // 舍弃毫秒
  if (val < 10) return '0' + val
  else return isNaN(val) ? '00' : val + ''
}

// 时间格式化为xx:xx
function timeParse (sec) {
  let min = Math.floor(sec / 60)
  sec = sec - min * 60
  return pad(min) + ':' + pad(sec)
}

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  playing: state.playing
})

class Audio extends Component {
  static propTypes = {
    playlist: PropTypes.array, // 播放列表
    playing: PropTypes.object // 正在播放的歌曲
  }

  static defaultProps = {
    playlist: [],
    playing: {}
  }

  state = {
    running: false,
    percent: 0,
    currentTime: '00:00',
    mouseoverTime: '00:00',
    lyricVisible: false
  }

  // 播放/暂停
  togglePlay = () => {
    // error.code: 1.用户终止 2.网络错误 3.解码错误 4.URL无效
    if (this.audio.error) return
    const newStatus = !this.state.running
    this.setState({ running: newStatus })
    console.log(timeParse(this.audio.duration), timeParse(this.audio.currentTime))
    newStatus ? this.audio.play() : this.audio.pause()
  }

  // 下一首
  next = () => {
    const { dispatch, playlist, playing } = this.props
    let index = playlist.findIndex(item => item.id === playing.id)
    // 如果是最后一首, 则回到第一首
    let newIndex = index !== -1 && playlist.length - 1 !== index ? index + 1 : 0
    dispatch(setPlaying(playlist[newIndex]))
  }

  // 上一首
  prev = () => {
    const { dispatch, playlist, playing } = this.props
    let index = playlist.findIndex(item => item.id === playing.id)
    // 如果已经是第一首, 无法继续往前
    let newIndex = index > 0 ? index - 1 : 0
    dispatch(setPlaying(playlist[newIndex]))
  }

  /**
   * 监听播放进度的改变
   */
  onTimeUpdate = () => {
    const newTime = timeParse(this.audio.currentTime)
    const percent = parseInt(this.audio.currentTime / this.audio.duration * 10000, 10) / 100
    this.setState({
      currentTime: newTime,
      percent
    })
  }

  onError = e => {
    console.log('error', e, this.audio && this.audio.error)
    const { running } = this.state
    if (running) {
      message.warning('当前歌曲无法播放, 即将播放下一首')
      this.setState({ running: false })
      setTimeout(() => this.next(), 1500)
    }
  }

  /**
   * 进度条点击
   */
  sliderClick = e => {
    const offsetX = e.nativeEvent.offsetX
    const offsetWidth = e.target.offsetWidth
    this.setCurrentTimeByPercent(offsetX / offsetWidth)
  }

  /**
   * 进度条悬浮
   */
  sliderMouseover = e => {
    const offsetX = e.nativeEvent.offsetX
    const offsetWidth = e.target.offsetWidth
    let percent = offsetX / offsetWidth
    let time = timeParse(this.getCurrentTimeByPercent(percent))
    this.setState({ mouseoverTime: time })
  }

  /**
   * 根据进度条百分比设置当前播放时间
   * @param  {Number} percent 百分比值
   */
  setCurrentTimeByPercent = percent => {
    this.audio.currentTime = this.getCurrentTimeByPercent(percent)
  }

  /**
   * 根据进度条百分比设置当前播放时间
   * @param  {Number} percent 百分比值
   * @return {Number}
   */
  getCurrentTimeByPercent = percent => {
    return Math.floor(percent * (this.audio.duration || 0))
  }

  /**
   * 接收到新的播放歌曲, 重置播放进度为初始化状态, 并播放
   */
  componentWillReceiveProps (nextProps) {
    // 只有playing改变才说明是新的歌曲
    if (nextProps.playing !== this.props.playing) {
      // let newId = nextProps.playing && nextProps.playing.id
      // let oldId = this.props.playing && this.props.playing.id
      // if (newId === oldId) return
      this.setState({
        currentTime: '00:00',
        percent: 0,
        running: true
      })
      this.setCurrentTimeByPercent(0)
    }
  }

  // 切换歌词界面显示|隐藏
  toggleLyricView = () => {
    const { playing } = this.props
    // 存在播放歌曲时才允许打开歌词界面
    if (playing && playing.id) {
      this.setState({lyricVisible: !this.state.lyricVisible})
    }
  }

  render () {
    const { playing, location } = this.props
    const { running, percent, currentTime, mouseoverTime, lyricVisible } = this.state
    const playIcon = running ? 'pause-circle' : 'play-circle'
    const src = playing.url || (playing.id
      ? `http://music.163.com/song/media/outer/url?id=${playing.id}.mp3`
      : '')
    return <div
      className={`audio-controller ${lyricVisible ? 'lyric-active' : ''}`}
      style={{background: location.pathname === '/lyric' ? 'transparent' : ''}}>
      <audio
        autoPlay={running}
        src={src}
        onTimeUpdate={this.onTimeUpdate}
        onEnded={this.next}
        onError={this.onError}
        ref={(audio) => { this.audio = audio }}>
      </audio>

      <div className="play-wrapper">
        <Icon type="step-backward" onClick={this.prev} style={{fontSize: '28px'}} />
        <Icon type={playIcon} onClick={this.togglePlay} />
        <Icon type="step-forward" onClick={this.next} style={{fontSize: '28px'}} />
      </div>

      <div className="slider-wrapper">
        <div className="meta">
          <div className="name">
            <span onClick={this.toggleLyricView}>{playing.name || 'iMusic'}</span>
          </div>
          <div className="audio-time">
            <span>{currentTime}</span>
            <Divider type="vertical" />
            <span>{timeParse(playing.duration / 1000)}</span>
          </div>
        </div>
        <Tooltip title={mouseoverTime}>
          <div
            className="slider-runway"
            onClick={this.sliderClick}
            onMouseMove={this.sliderMouseover}>
            <div className="slider-bar" style={{transform: `translateX(-${100 - percent}%)`}}></div>
          </div>
        </Tooltip>
      </div>

      <Lyric
        visible={lyricVisible}
        running={running}
        currentTime={currentTime}
        onClose={() => this.setState({lyricVisible: false})} />
    </div>
  }
}

export default withRouter(connect(mapStateToProps)(Audio))
