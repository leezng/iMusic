import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Input, Icon, Spin } from 'antd'
import { search, getUserSonglist } from 'renderer/actions'
import User from '../User'
import './index.less'

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

const menuData = [{
  name: '发现音乐',
  key: 'musicCenter',
  icon: 'appstore'
}, {
  name: '播放队列',
  key: 'playlist',
  icon: 'customer-service'
}, {
//   name: '我的音乐',
//   key: 'userMusicCenter',
//   icon: 'edit',
//   isLocal: false
// }, {
  name: '我的歌单',
  key: 'userSonglist',
  icon: 'heart-o',
  isLocal: false,
  subMenu: [] // subMenu数据实际来源于store
}]

class Sidebar extends Component {
  state = {
    activeMenu: 'musicCenter',
    spinning: false
  }

  componentDidMount () {
    const { location } = this.props
    const pathName = location.pathname.slice(1)
    pathName && this.setState({
      activeMenu: pathName
    })
  }

  componentWillReceiveProps (nextProps) {
    let oldId = this.props.user && this.props.user.profile && this.props.user.profile.userId
    let newId = nextProps.user && nextProps.user.profile && nextProps.user.profile.userId
    if (newId && newId !== oldId) {
      const { dispatch } = this.props
      this.setState({spinning: true})
      dispatch(getUserSonglist(newId)).then(res => {
        this.setState({spinning: false})
      }).catch(err => {
        console.warn(err)
        this.setState({spinning: false})
      })
    }
  }

  onSearch = text => {
    const keywords = text.trim()
    if (!keywords) return
    const { location, history, dispatch } = this.props
    dispatch(search(keywords, 15, 0))
    const newPath = '/searchlist'
    // 若在搜索结果页再次搜索, 无需跳转
    if (location.pathname !== newPath) {
      // 跳转到搜索结果页
      history.push(newPath)
      // 清除侧边栏激活标签
      this.setState({
        activeMenu: null
      })
    }
  }

  menuItemClick = ({ e, key, keyPath }) => {
    // TODO: 默认缺省路由
    // console.log('menuItemClick: ', e, key, keyPath)
    const { location, history } = this.props
    const newPath = `/${keyPath.reverse().join('/')}`
    if (location.pathname !== newPath) {
      history.push(newPath)
      this.setState({
        activeMenu: key
      })
    }
  }

  getMenuContent (menu, userSonglist) {
    return menu.map(item => {
      // 如果是用户歌单, 则subMenu数据来自store
      let subMenu = item.key === 'userSonglist' ? userSonglist : item.subMenu
      return subMenu
        ? <Menu.SubMenu
          key={item.key || item.id}
          title={<span><Icon type={item.icon} />{item.name}</span>}>
          {this.getMenuContent(subMenu)}
        </Menu.SubMenu>
        : <Menu.Item key={item.key || item.id}>
          {item.icon ? <Icon type={item.icon} /> : null}
          {item.name}
        </Menu.Item>
    })
  }

  render () {
    const { user } = this.props
    const menu = user.isLocal === false ? menuData : menuData.filter(k => k.isLocal !== false)
    const userSonglist = (user && user.songlist) || []
    return <div className="app-sidebar">
      <Spin spinning={this.state.spinning}>
        <User />
        <div className="search">
          <Input.Search
            placeholder="搜索"
            onSearch={this.onSearch} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[this.state.activeMenu]}
          defaultOpenKeys={['userSonglist']}
          onClick={this.menuItemClick}>
          {this.getMenuContent(menu, userSonglist)}
        </Menu>
      </Spin>
    </div>
  }
}

export default withRouter(connect(mapStateToProps)(Sidebar))
