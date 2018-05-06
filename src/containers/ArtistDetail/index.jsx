import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Card, Table } from 'antd'
import ActionGroup from '../ActionGroup'
import { connectBackHoc } from '../BackHoc'
import { setPlaylist, setPlaying } from 'src/actions'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  artists: state.artists
})

class ArtistDetail extends Component {
  static propTypes = {
    artists: PropTypes.object
  }

  static defaultProps = {
    artists: {}
  }

  state = {
    pageStartIndex: 0 // 热门歌曲列表中，当前页的起始索引
  }

  // 分页器页码变化回调
  handleOnChange = (pagination) => {
    this.setState({
      pageStartIndex: (pagination.current - 1) * pagination.pageSize
    })
  }

  songFormatter = (song, artist) => {
    // 约定的字段
    return {
      id: song.id,
      name: song.name,
      album: song.al,
      artists: [artist],
      lMusic: song.l,
      mMusic: song.m,
      hMusic: song.h
    }
  }

  // 获取table的column列渲染信息
  getColumnsTpl (artist) {
    return [{
      key: 'index',
      width: 40,
      // 分页起始索引 + 行索引 + 1
      render: (text, record, index) => this.state.pageStartIndex + index + 1
    }, {
      title: '歌曲',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '专辑',
      dataIndex: 'al',
      key: 'al',
      width: '40%',
      render: (text, record) => record.al && record.al.name
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => <ActionGroup
        actions={['play', 'add']}
        song={this.songFormatter(record, artist)} />
    }]
  }

  // 播放全部歌曲
  playAllSongs = (artist, songs = []) => {
    const { dispatch } = this.props
    const allSongs = songs.map(item => this.songFormatter(item, artist))
    dispatch(setPlaylist(allSongs))
    dispatch(setPlaying(allSongs[0]))
  }

  render () {
    const { match, artists } = this.props
    const id = match && match.params && +match.params.id
    const item = Array.isArray(artists.result) && artists.result.find(item => item.id === id)
    if (!item) return null // 该组件暂无考虑刷新的情况
    const { desc, hotSongs } = item.detail || {}
    const isLoading = artists.status === 'pending'

    return <div className="artist-detail">
      <Card
        hoverable
        loading={isLoading}
        cover={<img alt="歌手图片" src={item.picUrl} />}>
        <Card.Meta
          title={item.name}
          description={desc} />
      </Card>
      <div className="table-title">
        热门歌曲
        <div className="actions">
          <Button type="primary" size="small" icon="caret-right" onClick={() => this.playAllSongs(item, hotSongs)}>播放全部</Button>
        </div>
      </div>
      <Table
        size="middle"
        loading={isLoading}
        columns={this.getColumnsTpl(item)}
        dataSource={hotSongs || []}
        onChange={this.handleOnChange}
        rowKey="id" />
    </div>
  }
}

export default connect(mapStateToProps)(connectBackHoc(ArtistDetail))
