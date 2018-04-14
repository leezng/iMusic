import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import { search, addToPlaylist, setPlaying } from 'src/actions'
import "./index.less"

const mapStateToProps = (state, ownProps) => ({
  searchResult: state.searchResult
})

class Searchlist extends Component {
  static propTypes = {
    searchResult: PropTypes.object
  }

  static defaultProps = {
    searchResult: {}
  }

  onChange = (pageNo, pageSize) => {
    const { dispatch, searchResult } = this.props
    const { keywords } = searchResult
    dispatch(search(keywords, pageSize, pageNo - 1))
  }

  render () {
    const { dispatch } = this.props
    const { status, songs, songCount, pageSize } = this.props.searchResult
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      render: (text, record) => record.artists[0].name
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (<Button.Group size="small">
        <Button type="primary" icon="caret-right" onClick={() =>
          dispatch(addToPlaylist(record)) && dispatch(setPlaying(record))
        } />
        <Button type="primary" icon="plus-circle" onClick={() =>
          dispatch(addToPlaylist(record))
        } />
      </Button.Group>)
    }]
    return <Table
      className="searchlist"
      size="small"
      loading={status === 'pending'}
      pagination={{
        pageSize,
        total: songCount,
        onChange: this.onChange
      }}
      columns={columns}
      dataSource={songs}
      rowKey="id" />
  }
}

export default connect(mapStateToProps)(Searchlist)
