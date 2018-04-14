import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Layout, message } from 'antd'
import PropTypes from 'prop-types'
import { addToPlaylist, setPlaying } from 'src/actions'

import Sidebar from '../Sidebar'
import MusicCenter from '../MusicCenter'
import Audio from '../Audio'
import Playlist from '../Playlist'
import Searchlist from '../Searchlist'
import ArtistDetail from '../ArtistDetail'
import "./index.less"

const { Footer, Sider, Content } = Layout

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
          <Content className="app-content">
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/musicCenter" />} />
              <Route path="/musicCenter" component={MusicCenter} />
              <Route path="/playlist" component={Playlist} />
              <Route path="/searchlist" component={Searchlist} />
              <Route path="/artistDetail/:id" component={ArtistDetail} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
      <Footer className="app-footer">
        <Audio/>
      </Footer> 
    </Layout>
  }
}

export default withRouter(connect(mapStateToProps)(App))
