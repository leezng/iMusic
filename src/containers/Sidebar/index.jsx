import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import User from '../User'
import './index.less'

class Sidebar extends Component {
  state = {
    activeMenu: 'musicCenter'
  }

  componentDidMount () {
    const { location } = this.props
    this.setState({
      activeMenu: location.pathname.slice(1),
    })
  }

  menuItemClick = ({ e, key, keyPath }) => {
    const { location, match, history} = this.props
    const newPath = match.path === '/' ? key : `${match.path}/${key}`
    console.log(newPath, location, match)
    if (location.pathname !== newPath) {
      history.push(newPath)
      this.setState({
        activeMenu: key,
      })
    }
  }

  render () {
    return <div className="app-sidebar">
      <User/>
      <Menu selectedKeys={[this.state.activeMenu]} onClick={this.menuItemClick}>
        <Menu.Item key="musicCenter"><Icon type="mail" />音乐馆</Menu.Item>
        <Menu.Item key="playlist"><Icon type="customer-service" />播放列表</Menu.Item>
      </Menu>
    </div>
  }
}

export default withRouter(connect()(Sidebar))
