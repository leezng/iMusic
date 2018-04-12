import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Layout, Input, message } from 'antd'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import MusicCenter from '../MusicCenter'
import Controller from '../Controller'
import Playlist from '../Playlist'
import Searchlist from '../Searchlist'
import { search, addToPlaylist, setPlaying } from 'src/actions'
import "./index.less"

const { Header, Footer, Sider, Content } = Layout

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist
})

class App extends Component {
  static propTypes = {
    playlist: PropTypes.array
  }

  static defaultProps = {
    playlist: []
  }

  onSearch = text => {
    const keywords = text.trim()
    if (!keywords) return
    const { location, history, dispatch } = this.props
    dispatch(search(keywords, 15, 0))
    // 跳转到搜索结果页
    const newPath = '/searchlist'
    if (location.pathname !== newPath) history.push(newPath)
  }

  preventDefault = e => {
    e.stopPropagation()
    e.preventDefault()
  }

  onDrop = e => {
    this.preventDefault(e)
    const { dispatch, playlist } = this.props
    const event = e.nativeEvent
    let file = event.dataTransfer.files[0] // 暂时只处理一个文件
    if (playlist.find(item => item.path === file.path)) {
      message.warning('歌曲已经在播放列表中')
      return
    }
    let song = {
      name: file.name,
      url: URL.createObjectURL(file),
      isLocal: true,
      path: file.path, // 本地文件存储路径
      id: +new Date()
    }
    dispatch(addToPlaylist(song)) && dispatch(setPlaying(song))
  }

  render () {
    return <Layout className="app-container" onDragEnter={this.preventDefault} onDragOver={this.preventDefault} onDrop={this.onDrop}>
      <Layout>
        <Sider className="app-sider">
          <Sidebar/>
        </Sider>
        <Layout>
          <Header className="app-header">
            <Input.Search
              placeholder="input search text"
              onSearch={this.onSearch}
              style={{ width: 200 }}/>
          </Header>
          <Content className="app-content">
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/musicCenter" />} />
              <Route path="/musicCenter" component={MusicCenter} />
              <Route path="/playlist" component={Playlist} />
              <Route path="/searchlist" component={Searchlist} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
      <Footer className="app-footer">
        <Controller/>
      </Footer> 
    </Layout>
  }
}

export default withRouter(connect(mapStateToProps)(App))
