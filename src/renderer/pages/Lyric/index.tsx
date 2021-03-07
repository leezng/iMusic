import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/hooks';
import styles from './index.module.less';

export interface Props {
  // 歌词界面是否可见
  visible: boolean;
  // 播放|暂停
  running: boolean;
  // 界面关闭
  onClose: Function;
  // 当前的播放时间
  currentTime: string;
}

const Lyric: React.FC<Props> = ({ visible = false, running = false, onClose, currentTime }) => {
  const player = useSelector((state) => state.player);

  const { playing } = player;

  // 是否设置为transform: none的状态
  const [noTransform, setNoTransform] = useState(false);
  // 匹配的单句歌词索引
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: lyricArr = [] } = useRequest(
    (playing?.id || '') && {
      url: '/lyric',
      params: {
        id: playing?.id,
      },
    },
    {
      initialData: [],
      refreshDeps: [playing],
      formatResult: (result) => {
        const lyricStr = result?.lrc?.lyric || '';
        return lyricStr
          .replace(/\n/g, ',')
          .split(',')
          .filter((item) => item)
          .map((item) => {
            const contentStartIndex = item.indexOf(']') + 1;
            return {
              time: item.slice(1, 6),
              content: item.slice(contentStartIndex || 10).trim(),
            };
          });
      },
    },
  );

  // 类似于lyricArr, 此数据为对象, 便于数据查找
  const lyricMap = lyricArr.reduce(
    (acc, item, index) => ({
      ...acc,
      [item.time]: {
        content: item.content,
        index,
      },
    }),
    {},
  );

  // 监听播放时间变化
  const watchCurrentTime = (newTime) => {
    if (!newTime) return;
    const { index, content } = lyricMap[newTime] || {};
    if (content && index !== undefined) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    setTimeout(() => setNoTransform(visible), 100);
  }, [visible]);

  useEffect(() => {
    watchCurrentTime(currentTime);
  }, [currentTime]);

  if (!visible || !playing) return null; // 不可见

  const al = playing.al || {}; // 当前专辑
  const artist = (playing.ar && playing.ar[0]) || {};
  const coverUrl = al.picUrl || artist.picUrl || artist.img1v1Url;

  return (
    <div className={styles.lyric} style={{ transform: noTransform ? 'none' : '' }}>
      <div className="background" style={{ backgroundImage: `url(${coverUrl})` }} />
      <div className="content">
        <CloseOutlined className="close" onClick={onClose} />
        <div
          className={`cover ${running ? 'is-running' : ''}`}
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
        <div className="wrapper">
          <div className="wrapper-title">
            <h3>{playing.name}</h3>
            <div className="song-message">
              <span>歌手: {artist.name || '未知'}</span>
              <span>专辑: {al.name || '未知'}</span>
            </div>
          </div>
          <div className="wrapper-content">
            <div
              className="lyric-show"
              style={{ transform: `translateY(${160 + -40 * activeIndex}px)` }}
            >
              {lyricArr.map((item, index) => (
                <p key={index} className={activeIndex === index ? 'active' : ''}>
                  {item.content}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lyric;
