import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Avatar, Card, Divider, Table, Tooltip } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/hooks';
import ActionGroup from 'renderer/components/ActionGroup';

const ArtistDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data = {}, loading } = useRequest(
    {
      url: '/artists',
      params: {
        id,
      },
    },
    {
      initialData: {},
      refreshDeps: [id],
    },
  );

  const { artist = {}, hotSongs = [] } = data as Record<string, any>;

  const songFormatter = (song, artist) => {
    // 约定的字段
    return {
      id: song.id,
      name: song.name,
      album: song.al,
      artists: [artist],
      lMusic: song.l,
      mMusic: song.m,
      hMusic: song.h,
    };
  };

  // 获取table的column列渲染信息
  const getColumnsTpl = () => {
    return [
      {
        key: 'index',
        width: 40,
      },
      {
        title: '歌曲',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '专辑',
        dataIndex: 'al',
        key: 'al',
        width: '40%',
        render: (text, record) => record.al && record.al.name,
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (text, record) => (
          <ActionGroup actions={['play', 'add']} song={songFormatter(record, artist)} />
        ),
      },
    ];
  };

  // 播放全部歌曲
  const playAllSongs = (artist, songs = []) => {
    const allSongs = songs.map((item) => songFormatter(item, artist));
    dispatch({
      type: 'setPlaylist',
      payload: {
        playlist: allSongs,
      },
    });
    dispatch({
      type: 'setPlaying',
      payload: {
        playing: allSongs[0],
      },
    });
  };

  return (
    <div className="artist-detail">
      <Card loading={loading}>
        <Card.Meta
          avatar={<Avatar size={100} alt="歌手图片" src={artist?.picUrl} />}
          title={artist?.name}
          description={artist?.briefDesc}
        />
      </Card>
      <Divider orientation="left">
        <span style={{ marginRight: 5 }}>热门歌曲</span>
        <Tooltip title="播放全部">
          <PlayCircleOutlined onClick={() => playAllSongs({}, hotSongs)} />
        </Tooltip>
      </Divider>
      <Table
        size="middle"
        loading={loading}
        columns={getColumnsTpl()}
        dataSource={hotSongs}
        rowKey="id"
      />
    </div>
  );
};

export default ArtistDetail;
