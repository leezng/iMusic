import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, Table } from 'antd'
import ActionGroup from '../ActionGroup'
import { connectBackHoc } from '../BackHoc'
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

  render () {
    const { match, artists } = this.props
    const id = match && match.params && +match.params.id
    const item = Array.isArray(artists.result) && artists.result.find(item => item.id === id)
    if (!item) return null // 改组件暂无考虑刷新的情况
    const { desc, hotSongs } = item.detail || {}
    const isLoading = artists.status === 'pending'
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '专辑',
      dataIndex: 'al',
      key: 'al',
      render: (text, record) => record.al && record.al.name
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => <ActionGroup
        actions={['play', 'add']}
        song={this.songFormatter(record, item)} />
    }]

    return <div className="artist-detail">
      <Card
        hoverable
        loading={isLoading}
        cover={<img alt="歌手图片" src={item.picUrl} />}>
        <Card.Meta
          title={item.name}
          description={desc} />
      </Card>
      <Table
        size="middle"
        loading={isLoading}
        columns={columns}
        dataSource={hotSongs || []}
        rowKey="id" />
    </div>
  }
}

export default connect(mapStateToProps)(connectBackHoc(ArtistDetail))
