import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import ActionGroup from '../ActionGroup'
import { getUserSonglistDetail } from 'src/actions'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

class UserSonglist extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  static defaultProps = {
    user: {}
  }

  state = {
    loading: false
  }

  getData () {
    const { dispatch, user } = this.props
    const id = this.getId(this.props)
    const item = Array.isArray(user.songlist) && user.songlist.find(item => item.id === id)
    if (!item.tracks) {
      this.setState({loading: true})
      dispatch(getUserSonglistDetail(id)).then(res => {
        this.setState({loading: false})
      }).catch(err => {
        console.log(err)
        this.setState({loading: false})
      })
    }
  }

  getId (props) {
    return props.match && props.match.params && +props.match.params.id
  }

  componentDidMount () {
    this.getData()
  }

  componentWillReceiveProps (nextProps) {
    const oldId = this.getId(this.props)
    const newId = this.getId(nextProps)
    if (newId && newId !== oldId) this.getData()
  }

  render () {
    const { user } = this.props
    const id = this.getId(this.props)
    const item = Array.isArray(user.songlist) && user.songlist.find(item => item.id === id)
    if (!item) return null
    const columns = [{
      title: '歌曲',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      width: '40%',
      render: (text, record) => record.artists[0].name
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => <ActionGroup
        actions={['play', 'add']}
        song={record} />
    }]

    return <div className="artist-detail">
      <Table
        size="middle"
        loading={this.state.loading}
        columns={columns}
        dataSource={item.tracks || []}
        rowKey="id" />
    </div>
  }
}

export default connect(mapStateToProps)(UserSonglist)
