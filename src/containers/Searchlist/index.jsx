import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { search } from 'src/actions'
import ActionGroup from '../ActionGroup'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  searchResult: state.searchResult
})

// 搜索结果列表
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
      render: (text, record) => <ActionGroup
        actions={['play', 'add']}
        song={record} />
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
