import React from 'react';
import { useDispatch } from 'react-redux';
import { useRequest } from '@umijs/hooks';
import CardList from 'renderer/components/CardList';

const Comp = () => {
  const dispatch = useDispatch();

  const { data = [], loading } = useRequest(
    {
      url: '/personalized',
    },
    {
      initialData: [],
      formatResult: (data) => data?.result || [],
    },
  );

  const onItemClick = (item) => {
    // // 获取歌单详情
    // getSongListDetail (id) {
    //   return axios.get(`/playlist/detail?id=${id}`)
    //     .then(res => res.data)
    // }
    if (!item.detail) {
      // dispatch(getSongListDetail(item.id))
    } else {
      const playlist = item.detail.tracks || [];
      dispatch({
        type: 'setPlaylist',
        payload: { playlist },
      });
      dispatch({
        type: 'setPlaying',
        payload: {
          playing: playlist[0],
        },
      });
    }
  };

  return <CardList loading={loading} dataSource={data} onItemClick={onItemClick} />;
};

export default Comp;
