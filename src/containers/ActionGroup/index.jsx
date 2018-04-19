/*
 * 歌曲列表中, 单曲的操作按钮组
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import {
  setPlaying,
  addToPlaylist,
  removeFromPlaylist
} from 'src/actions'

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

  switcher = (action, song) => {
    const { dispatch } = this.props
    switch (action) {
      case 'play':
        return {
          icon: 'caret-right',
          onClick: () => dispatch(addToPlaylist(song)) && dispatch(setPlaying(song))
        }
      case 'add':
        return {
          icon: 'plus-circle',
          onClick: () => dispatch(addToPlaylist(song))
        }
      case 'remove':
        return {
          icon: 'delete',
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

export default connect()(ActionGroup)
