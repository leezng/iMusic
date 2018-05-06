/**
 * 本地播放队列
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Button, Table, Tag, Popconfirm } from 'antd'
import ActionGroup from '../ActionGroup'
import { clearPlaylist, upsetPlaylist } from 'src/actions'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist,
  playing: state.playing
})

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
    const { playlist, playing, dispatch } = this.props
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
    const enabled = playlist && playlist.length
    return <div className="playlist">
      <div className="operations">
        <Button icon="rocket" size="small" disabled={!enabled} onClick={() => dispatch(upsetPlaylist())}>打乱顺序</Button>
        <Popconfirm title="你真的要清空整个队列吗?" onConfirm={() => dispatch(clearPlaylist())}  okText="确认" cancelText="取消">
          <Button icon="delete" size="small" type="danger" disabled={!enabled}>清空播放队列</Button>
        </Popconfirm>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={playlist}
        locale={{
          emptyText: '暂无歌曲'
        }}
        rowKey="id" />
    </div>
  }
}

export default connect(mapStateToProps)(Playlist)
