import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Table, Tag } from 'antd'
import ActionGroup from '../ActionGroup'

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  playing: state.playing
})

// 播放列表
class Playlist extends Component {
  static propTypes = {
    playlist: PropTypes.array,
    playing: PropTypes.object
  }

  static defaultProps = {
    playlist: [],
    playing: {}
  }

  render () {
    const { playlist, playing } = this.props
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return playing.id === record.id
          ? <span>
            {record.name}<Tag color="magenta" style={{marginLeft: 10}}>正在播放</Tag>
          </span>
          : record.name
      }
    }, {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      render: (text, record) => record.artists[0].name
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => <ActionGroup
        actions={['play', 'remove']}
        song={record} />
    }]

    return <Table
      className="playlist"
      size="small"
      columns={columns}
      dataSource={playlist}
      rowKey="id" />
  }
}

export default connect(mapStateToProps)(Playlist)
