import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Table, Button } from 'antd'
import { removeFromPlaylist, clearPlaylist, setPlaying } from 'src/actions'
import "./index.less"

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
    const { playlist, dispatch } = this.props
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: 'artists',
      dataIndex: 'artists',
      key: 'artists',
      render: (text, record) => record.artists[0].name
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (<Button.Group size="small">
        <Button type="primary" icon="caret-right" onClick={() =>
          dispatch(setPlaying(record))
        } />
        <Button type="primary" icon="delete" onClick={() =>
          dispatch(removeFromPlaylist(record.id))
        } />
      </Button.Group>)
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
