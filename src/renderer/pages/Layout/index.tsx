import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { Layout, message } from 'antd';

import MusicCenter from '../MusicCenter';
import Playlist from '../Playlist';
import SearchList from '../SearchList';
import ArtistDetail from '../ArtistDetail';
import UserSongList from '../UserSongList';
import Setting from '../Setting';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';
import Audio from './Audio';
import styles from './index.module.less';

const { Footer, Content } = Layout;

const App = () => {
  const dispatch = useDispatch();

  const player = useSelector((state) => state.player);

  const { playlist } = player;

  const preventDefault = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onDrop = (e) => {
    preventDefault(e);
    const event = e.nativeEvent;
    const file = event.dataTransfer.files[0]; // 暂时只处理一个文件
    if (playlist.find((item) => item.path === file.path)) {
      message.warning('歌曲已经在播放列表中');
      return;
    }
    const song = {
      name: file.name,
      url: URL.createObjectURL(file),
      isLocal: true,
      path: file.path, // 本地文件存储路径
      id: +new Date(), // TODO 本地歌曲ID如何生成?
    };
    dispatch({
      type: 'setPlaylist',
      payload: {
        playlist: playlist.concat(song),
      },
    });
    dispatch({
      type: 'setPlaying',
      payload: {
        playing: song,
      },
    });
  };

  // 获取用户歌单等也会使得status=pending
  return (
    <Layout
      onDragEnter={preventDefault}
      onDragOver={preventDefault}
      onDrop={onDrop}
      style={{ height: '100%' }}
    >
      <Layout>
        <Sidebar />
        <Layout>
          <TitleBar />
          <Content className={styles.content}>
            <Switch>
              <Route exact path="/" component={() => <Redirect to="/musicCenter" />} />
              <Route path="/musicCenter" component={MusicCenter} />
              <Route path="/playlist" component={Playlist} />
              <Route path="/searchList" component={SearchList} />
              <Route path="/artistDetail/:id" component={ArtistDetail} />
              <Route path="/userSongList/:id" component={UserSongList} />
              <Route path="/setting" component={Setting} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
      <Footer className={styles.footer}>
        <Audio />
      </Footer>
    </Layout>
  );
};

export default App;
