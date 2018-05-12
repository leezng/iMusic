/*
 * 歌曲列表中, 单曲的操作按钮组
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, message } from 'antd'
import {
  setPlaying,
  addToPlaylist,
  removeFromPlaylist
} from 'renderer/actions'

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  playing: state.playing
})

class ActionGroup extends Component {
  static propTypes = {
    // actions为描述操作组的配置[StringArray], 可选: add, remove, play
    actions: PropTypes.array.isRequired,
    // song必要的关键字段: id, name, album, artists, lMusic, mMusic, hMusic
    song: PropTypes.object.isRequired
  }

  static defaultProps = {
    actions: [],
    song: {}
  }

  /**
   * 新的歌曲不存在队列中, 才进行添加
   * @param  {Object}  song  歌曲
   * @param  {Boolean} ignoreError 是否忽略错误
   */
  addToPlaylist = (song, ignoreError = false) => {
    const { dispatch, playlist } = this.props
    const exist = playlist.findIndex(item => item.id === song.id) !== -1
    if (!exist) dispatch(addToPlaylist(song))
    else if (!ignoreError) message.warning('歌曲已存在播放队列中')
  }

  switcher = (action, song) => {
    const { dispatch, playing } = this.props
    switch (action) {
      // 播放
      case 'play':
        return {
          icon: 'caret-right',
          title: '播放歌曲',
          disabled: playing && playing.id === song.id, // 歌曲正在播放, 设置为disabled
          onClick: () => {
            this.addToPlaylist(song, true)
            // 当前没有播放歌曲/正在播放的歌曲ID不一致, 则更新正在播放
            if (!playing || playing.id !== song.id) {
              dispatch(setPlaying(song))
            }
          }
        }
      // 添加到播放队列
      case 'add':
        return {
          icon: 'plus-circle',
          title: '添加到播放队列',
          onClick: () => this.addToPlaylist(song)
        }
      // 从播放队列中移除
      case 'remove':
        return {
          icon: 'delete',
          title: '从播放队列中移除',
          onClick: () => dispatch(removeFromPlaylist(song.id))
        }
    }
  }

  render () {
    const { actions, song } = this.props
    return <Button.Group size="small">{
      actions.map((item, index) => {
        const props = this.switcher(item, song)
        return <Button key={index} type="primary" {...props} />
      })
    }</Button.Group>
  }
}

export default connect(mapStateToProps)(ActionGroup)
