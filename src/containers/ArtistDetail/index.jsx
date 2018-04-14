import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Card, Table } from 'antd'
import { addToPlaylist, setPlaying } from 'src/actions'
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
    const { match, dispatch, artists } = this.props
    const id = match && match.params && +match.params.id
    const item = Array.isArray(artists.result) && artists.result.find(item => item.id === id)
    if (!item) return null
    const { desc, hotSongs } = item.detail || {}
    const isLoading = artists.status === 'pending'
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name'
    // }, {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    }, {
      title: '专辑',
      dataIndex: 'al',
      key: 'al',
      render: (text, record) => record.al && record.al.name
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (<Button.Group size="small">
        <Button type="primary" icon="caret-right" onClick={() => {
          let song = this.songFormatter(record, item)
          dispatch(addToPlaylist(song)) && dispatch(setPlaying(song))
        }} />
        <Button type="primary" icon="plus-circle" onClick={() => {
          let song = this.songFormatter(record, item)
          dispatch(addToPlaylist(song))
        }} />
      </Button.Group>)
    }]

    return <div className="artist-detail">
      <Card
        hoverable
        loading={isLoading}
        cover={<img alt="歌手图片" src={item.picUrl} />}>
        <Card.Meta
          title={item.name}
          description={desc}/>
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

export default connect(mapStateToProps)(ArtistDetail)
