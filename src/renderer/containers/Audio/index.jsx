import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon, Tooltip, Divider, message } from 'antd'
import Lyric from '../Lyric'
import { setPlaying, setPreferences } from 'renderer/actions'
import { getRandomIntInclusive } from 'renderer/utils'
import call from 'main/call'
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
  preferences: state.preferences,
  playlist: state.playlist,
  playing: state.playing
})

// 播放模式列表
const playModeList = [{
  label: '顺序播放',
  value: 'order',
  icon: 'sync'
}, {
  label: '单曲循环',
  value: 'loop',
  icon: 'reload'
}, {
  label: '随机播放',
  value: 'random',
  icon: 'fork'
}]

// 根据playMode的值找到对应的icon
function getPlayModeItem (mode) {
  if (!mode) return playModeList[0]
  return playModeList.find(item => item.value === mode)
}

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
    running: false, // 是否播放中
    percent: 0, // 播放进度百分比
    currentTime: '00:00', // 当前播放时间
    mouseoverTime: '00:00', // 鼠标悬浮时间
    lyricVisible: false // 歌词界面是否可见
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
    const { dispatch, playlist, playing, preferences } = this.props
    let index = playlist.findIndex(item => item.id === playing.id)
    let newIndex
    if (preferences.playMode === 'random') {
      // 随机模式, 获取随机数
      newIndex = getRandomIntInclusive(0, playlist.length - 1)
    } else if (index === playlist.length - 1) {
      // 普通模式, 如果是最后一首, 则回到第一首
      newIndex = 0
    } else {
      // 普通模式(包括顺序与单曲循环), 下一首
      newIndex = index + 1
    }
    // 解构拷贝, 避免引用无法判断为新的歌曲
    dispatch(setPlaying({...playlist[newIndex]}))
  }

  // 上一首
  prev = () => {
    const { dispatch, playlist, playing } = this.props
    let index = playlist.findIndex(item => item.id === playing.id)
    // 如果已经是第一首, 无法继续往前
    let newIndex = index > 0 ? index - 1 : 0
    dispatch(setPlaying({...playlist[newIndex]}))
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
    //    注意playing.id可能是一致的, 即切换后的歌曲还是同一首, 但也应重新播放
    if (nextProps.playing !== this.props.playing) {
      this.setState({
        currentTime: '00:00',
        percent: 0,
        running: true
      })
      this.setCurrentTimeByPercent(0)
    }
  }

  componentDidMount () {
    // 监听播放暂停
    call.rendererOn('toggle-play', this.togglePlay)
  }

  // 切换歌词界面显示|隐藏
  toggleLyricView = () => {
    const { playing } = this.props
    // 存在播放歌曲时才允许打开歌词界面
    if (playing && playing.id) {
      this.setState({lyricVisible: !this.state.lyricVisible})
    }
  }

  /**
   * 切换播放模式
   */
  togglePlayMode = () => {
    let { preferences, dispatch } = this.props
    const oldModeVal = preferences.playMode
    const oldIndex = playModeList.findIndex(item => item.value === oldModeVal)
    // 模式按顺序循环切换
    const newIndex = oldIndex !== -1 && playModeList.length - 1 !== oldIndex ? oldIndex + 1 : 0
    const newModeVal = playModeList[newIndex].value
    if (!preferences) preferences = {}
    preferences.playMode = newModeVal
    dispatch(setPreferences(preferences))
    return newModeVal
  }

  render () {
    const { playlist, playing, location, preferences } = this.props
    const { running, percent, currentTime, mouseoverTime, lyricVisible } = this.state
    // 播放|暂停图标
    const playIcon = running ? 'pause-circle' : 'play-circle'
    // 当前播放模式
    const playMode = getPlayModeItem(preferences.playMode)
    const src = playing.url || (playing.id
      ? `http://music.163.com/song/media/outer/url?id=${playing.id}.mp3`
      : '')
    return <div
      className={`audio-controller ${lyricVisible ? 'lyric-active' : ''}`}
      style={{background: location.pathname === '/lyric' ? 'transparent' : ''}}>
      {/* 若播放列表长度为1, 也应设置loop=true, 否则无法自动切换 */}
      <audio
        autoPlay={running}
        loop={playMode.value === 'loop' || playlist.length === 1}
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

      <div className="control-wrapper" style={{fontSize: '12px'}}>
        <Icon type={playMode.icon} title={playMode.label} onClick={() => this.togglePlayMode(playMode.value)} />
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
