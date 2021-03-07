import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRequest } from '@umijs/hooks';
import CardList from 'renderer/components/CardList';

const Comp = () => {
  const dispatch = useDispatch();

  const player = useSelector((state) => state.player);

  const { playlist } = player;

  const { data = [], loading } = useRequest(
    {
      url: '/personalized/djprogram',
    },
    {
      initialData: [],
      formatResult: (data) => data?.result || [],
    },
  );

  const onItemClick = (item) => {
    const song = item && item.program && item.program.mainSong;
    if (!song) return;
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

  return <CardList loading={loading} dataSource={data} onItemClick={onItemClick} />;
};

export default Comp;
