import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs } from 'antd'
import TopArtists from '../TopArtists'
import Songlist from '../Songlist'
import Djprogram from '../Djprogram'
import './index.less'

const TabPane = Tabs.TabPane

// 发现音乐(音乐馆)
class MusicCenter extends Component {
  state = {
    activeTab: 'topArtists'
  }

  handleTabChange = tabKey => {
    // console.log('handleTabChange: ', tabKey)
    this.setState({
      activeTab: tabKey
    })
  }

  render () {
    const { activeTab } = this.state
    return <Tabs
      defaultActiveKey={this.state.activeTab} onChange={this.handleTabChange}>
      <TabPane tab="热门歌手" key="topArtists">
        <TopArtists isActive={activeTab === 'topArtists'} />
      </TabPane>
      <TabPane tab="推荐歌单" key="songList">
        <Songlist isActive={activeTab === 'songList'} />
      </TabPane>
      <TabPane tab="推荐电台" key="djprogram">
        <Djprogram isActive={activeTab === 'djprogram'} />
      </TabPane>
      <TabPane tab="Tab 4" key="4">Content of tab 4</TabPane>
    </Tabs>
  }
}

export default connect()(MusicCenter)
