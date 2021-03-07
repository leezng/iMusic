/*
 * 歌曲列表中, 单曲的操作按钮组
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, message } from 'antd';
import { PlayCircleOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export type ActionsType = 'add' | 'remove' | 'play';

export interface Props {
  actions: ActionsType[];
  // song必要的关键字段: id, name, album, artists, lMusic, mMusic, hMusic
  song: Record<string, unknown>;
}

const ActionGroup: React.FC<Props> = ({ actions = [], song = {} }) => {
  const dispatch = useDispatch();
  const player = useSelector((state) => state.player);

  const { playing, playlist } = player;

  // 新的歌曲不存在队列中, 才进行添加
  const addToPlaylist = (song) => {
    if (playlist.some((item) => item.id === song.id)) {
      message.warning('歌曲已存在播放队列中');
      return;
    }
    dispatch({
      type: 'setPlaylist',
      payload: {
        playlist: playlist.concat(song),
      },
    });
  };

  const switcher = (action: ActionsType, song) => {
    const actionMap = {
      // 播放
      play: {
        Icon: PlayCircleOutlined,
        title: '播放歌曲',
        disabled: playing && playing.id === song.id, // 歌曲正在播放, 设置为disabled
        onClick: () => {
          if (playlist.every((item) => item.id !== song.id)) {
            addToPlaylist(song);
          }
          // 当前没有播放歌曲/正在播放的歌曲ID不一致, 则更新正在播放
          if (!playing || playing.id !== song.id) {
            dispatch({
              type: 'setPlaying',
              payload: {
                playing: song,
              },
            });
          }
        },
      },
      // 添加到播放队列
      add: {
        Icon: PlusCircleOutlined,
        title: '添加到播放队列',
        onClick: () => addToPlaylist(song),
      },
      // 从播放队列中移除
      remove: {
        Icon: DeleteOutlined,
        title: '从播放队列中移除',
        onClick: () => dispatch({ type: 'removeFromPlaylist', payload: { id: song.id } }),
      },
    };
    return actionMap[action];
  };

  return (
    <>
      {actions.map((item, index) => {
        const { title, Icon, onClick } = switcher(item, song);

        return (
          <Tooltip title={title} key={index}>
            <Icon style={{ marginRight: 5, cursor: 'pointer' }} onClick={onClick} />
          </Tooltip>
        );
      })}
    </>
  );
};

export default ActionGroup;
