import React, { useState } from 'react';
import { Tabs } from 'antd';
import TopArtists from '../TopArtists';
import SongList from '../SongList';
import Djprogram from '../Djprogram';

const { TabPane } = Tabs;

// 发现音乐(音乐馆)
const MusicCenter = () => {
  const [activeTab, setActiveTab] = useState('topArtists');

  const handleTabChange = (tabKey) => {
    // console.log('handleTabChange: ', tabKey)
    setActiveTab(tabKey);
  };

  return (
    <Tabs defaultActiveKey={activeTab} onChange={handleTabChange}>
      <TabPane tab="热门歌手" key="topArtists">
        <TopArtists />
      </TabPane>
      <TabPane tab="推荐歌单" key="songList">
        <SongList />
      </TabPane>
      <TabPane tab="推荐电台" key="djprogram">
        <Djprogram />
      </TabPane>
    </Tabs>
  );
};

export default MusicCenter;
