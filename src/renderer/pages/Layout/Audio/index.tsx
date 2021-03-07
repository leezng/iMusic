import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip, Divider, message } from 'antd';
import {
  SyncOutlined,
  ReloadOutlined,
  ForkOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { getRandomIntInclusive } from 'renderer/utils/helper';
import { call } from 'renderer/utils/rpc';
import Lyric from '../../Lyric';
import styles from './index.module.less';

// 时间一位数时加0
function pad(val) {
  const sVal = Math.floor(val); // 舍弃毫秒
  if (sVal < 10) return `0${sVal}`;
  return Number.isNaN(sVal) ? '00' : sVal.toString();
}

// 时间格式化为xx:xx
function timeParse(sec) {
  const min = Math.floor(sec / 60);
  const secVal = sec - min * 60;
  return `${pad(min)}:${pad(secVal)}`;
}

// 播放模式列表
const playModeList = [
  {
    label: '顺序播放',
    value: 'order',
    icon: <SyncOutlined />,
  },
  {
    label: '单曲循环',
    value: 'loop',
    icon: <ReloadOutlined />,
  },
  {
    label: '随机播放',
    value: 'random',
    icon: <ForkOutlined />,
  },
];

// 根据playMode的值找到对应的icon
function getPlayModeItem(mode) {
  if (!mode) return playModeList[0];
  return playModeList.find((item) => item.value === mode);
}

const Audio = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const preferences = useSelector((state) => state.preferences);
  const player = useSelector((state) => state.player);

  const { playing, playlist } = player;

  const audioRef = useRef<HTMLAudioElement>(null);
  const { current: audio } = audioRef;

  // 是否播放中
  const [running, setRunning] = useState(false);
  // 播放进度百分比
  const [percent, setPercent] = useState(0);
  // 当前播放时间
  const [currentTime, setCurrentTime] = useState('00:00');
  // 鼠标悬浮时间
  const [mouseoverTime, setMouseoverTime] = useState('00:00');
  // 歌词界面是否可见
  const [lyricVisible, setLyricVisible] = useState(false);

  // 播放/暂停
  const togglePlay = () => {
    // error.code: 1.用户终止 2.网络错误 3.解码错误 4.URL无效
    if (audio?.error) return;
    const newStatus = !running;
    setRunning(newStatus);
    console.log(timeParse(audio?.duration), timeParse(audio?.currentTime));
    if (newStatus) {
      audio?.play();
    } else {
      audio?.pause();
    }
  };

  // 下一首
  const next = () => {
    const index = playlist.findIndex((item) => item.id === playing?.id);
    let newIndex;
    if (preferences.playMode === 'random') {
      // 随机模式, 获取随机数
      newIndex = getRandomIntInclusive(0, playlist.length - 1);
    } else if (index === playlist.length - 1) {
      // 普通模式, 如果是最后一首, 则回到第一首
      newIndex = 0;
    } else {
      // 普通模式(包括顺序与单曲循环), 下一首
      newIndex = index + 1;
    }
    // 解构拷贝, 避免引用无法判断为新的歌曲
    dispatch({
      type: 'setPlaying',
      payload: {
        playing: { ...playlist[newIndex] },
      },
    });
  };

  // 上一首
  const prev = () => {
    const index = playlist.findIndex((item) => item.id === playing?.id);
    // 如果已经是第一首, 无法继续往前
    const newIndex = index > 0 ? index - 1 : 0;
    dispatch({
      type: 'setPlaying',
      payload: {
        playing: { ...playlist[newIndex] },
      },
    });
  };

  /**
   * 监听播放进度的改变
   */
  const onTimeUpdate = () => {
    // console.log('onTimeUpdate');
    const newTime = timeParse(audio?.currentTime);
    const newPercent = parseInt((audio?.currentTime / audio?.duration) * 10000, 10) / 100;
    setCurrentTime(newTime);
    setPercent(newPercent);
  };

  const onAudioError = (e) => {
    console.log('onAudioError', e);
    if (running) {
      message.warning('当前歌曲无法播放, 即将播放下一首');
      setRunning(false);
      setTimeout(() => next(), 1500);
    }
  };

  /**
   * 根据进度条百分比设置当前播放时间
   * @param  {Number} percent 百分比值
   * @return {Number}
   */
  const getCurrentTimeByPercent = (percent) => {
    return Math.floor(percent * (audio?.duration || 0));
  };

  /**
   * 根据进度条百分比设置当前播放时间
   * @param  {Number} percent 百分比值
   */
  const setCurrentTimeByPercent = (percent) => {
    if (audio) {
      audio.currentTime = getCurrentTimeByPercent(percent);
    }
  };

  /**
   * 进度条点击
   */
  const sliderClick = (e) => {
    const { offsetX } = e.nativeEvent;
    const { offsetWidth } = e.target;
    setCurrentTimeByPercent(offsetX / offsetWidth);
  };

  /**
   * 进度条悬浮
   */
  const sliderMouseover = (e) => {
    const { offsetX } = e.nativeEvent;
    const { offsetWidth } = e.target;
    const percent = offsetX / offsetWidth;
    const time = timeParse(getCurrentTimeByPercent(percent));
    setMouseoverTime(time);
  };

  /**
   * 接收到新的播放歌曲, 重置播放进度为初始化状态, 并播放
   */
  useEffect(() => {
    if (playing?.id) {
      setRunning(true);
      setPercent(0);
      setCurrentTime('00:00');
      setCurrentTimeByPercent(0);
    }
  }, [playing]);

  useEffect(() => {
    // 监听播放暂停
    call.rendererOn('toggle-play', togglePlay);
  }, []);

  // 切换歌词界面显示|隐藏
  const toggleLyricView = () => {
    // 存在播放歌曲时才允许打开歌词界面
    if (playing && playing.id) {
      setLyricVisible(!lyricVisible);
    }
  };

  /**
   * 切换播放模式
   */
  const togglePlayMode = () => {
    const oldModeVal = preferences.playMode;
    const oldIndex = playModeList.findIndex((item) => item.value === oldModeVal);
    // 模式按顺序循环切换
    const newIndex = oldIndex !== -1 && playModeList.length - 1 !== oldIndex ? oldIndex + 1 : 0;
    const newModeVal = playModeList[newIndex].value;
    dispatch({
      type: 'setPreferences',
      payload: {
        ...preferences,
        playMode: newModeVal,
      },
    });
    return newModeVal;
  };

  // 播放|暂停图标
  const playIcon = running ? (
    <PauseCircleOutlined onClick={togglePlay} />
  ) : (
    <PlayCircleOutlined onClick={togglePlay} />
  );
  // 当前播放模式
  const playMode = getPlayModeItem(preferences.playMode);
  const src =
    playing?.url ||
    (playing?.id ? `http://music.163.com/song/media/outer/url?id=${playing.id}.mp3` : '');

  return (
    <div
      className={`${styles.audioController} ${lyricVisible ? styles.lyricActive : ''}`}
      style={{ background: location.pathname === '/lyric' ? 'transparent' : '' }}
    >
      {/* 若播放列表长度为1, 也应设置loop=true, 否则无法自动切换 */}
      <audio
        autoPlay={running}
        loop={playMode.value === 'loop' || playlist.length === 1}
        src={src}
        onTimeUpdate={onTimeUpdate}
        onEnded={next}
        onError={onAudioError}
        ref={audioRef}
      >
        <track kind="captions" />
      </audio>

      <div className="play-wrapper">
        <StepBackwardOutlined onClick={prev} style={{ fontSize: '28px' }} />
        {playIcon}
        <StepForwardOutlined onClick={next} style={{ fontSize: '28px' }} />
      </div>

      <div className="slider-wrapper">
        <div className="meta">
          <div className="name">
            <span onClick={toggleLyricView}>{playing?.name || 'iMusic'}</span>
          </div>
          <div className="audio-time">
            <span>{currentTime}</span>
            <Divider type="vertical" />
            <span>{timeParse(audio?.duration)}</span>
          </div>
        </div>
        <Tooltip title={mouseoverTime}>
          <div className="slider-runway" onClick={sliderClick} onMouseMove={sliderMouseover}>
            <div className="slider-bar" style={{ transform: `translateX(-${100 - percent}%)` }} />
          </div>
        </Tooltip>
      </div>

      <div className="control-wrapper" style={{ fontSize: '12px' }}>
        <span title={playMode.label} onClick={() => togglePlayMode(playMode.value)}>
          {playMode.icon}
        </span>
      </div>

      <Lyric
        visible={lyricVisible}
        running={running}
        currentTime={currentTime}
        onClose={() => setLyricVisible(false)}
      />
    </div>
  );
};

export default Audio;
