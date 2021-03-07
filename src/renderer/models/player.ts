export interface SongState {
  name: string;
  id?: string;
  // 本地歌曲才有下面字段
  url?: string;
  path?: string;
}

export interface PlayingState extends SongState {
  duration: number;
}

export interface PlayerState {
  playing: PlayingState | null;
  playlist: SongState[];
}

// 本地播放列表的存储键名
const KEY = '_IMUSIC_PLAYLIST';

// 获取本地
function getLocalStorage(key = KEY) {
  const str = window.localStorage.getItem(key);
  return str ? JSON.parse(str) : [];
}

// 存储到本地
function setLocalStorage(value: SongState[], key = KEY) {
  if (setLocalStorage.timer) clearTimeout(setLocalStorage.timer);

  setLocalStorage.timer = setTimeout(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, 500);
}

const state: PlayerState = {
  playing: null,
  playlist: getLocalStorage() || [],
};

const reducers = {
  setPlaying: (state: PlayerState, payload) => {
    return {
      ...state,
      playing: payload.playing || null,
    };
  },

  setPlaylist: (state: PlayerState, payload) => {
    const newPlaylist = payload.playlist || [];
    setLocalStorage(newPlaylist);
    return {
      ...state,
      playlist: newPlaylist,
    };
  },

  removeFromPlaylist: (state: PlayerState, payload) => {
    const newPlaylist = [...state.playlist];
    const index = newPlaylist.findIndex((item) => item.id === payload.id);
    if (index !== -1) newPlaylist.splice(index, 1);
    setLocalStorage(newPlaylist);
    return {
      ...state,
      playlist: newPlaylist,
    };
  },

  upsetPlaylist: (state: PlayerState) => {
    const newPlaylist = state.playlist.sort(() => Math.random() - 0.5);
    setLocalStorage(newPlaylist);
    return {
      ...state,
      playlist: [...newPlaylist],
    };
  },
};

const output = (stateData = state, action) => {
  const { type, payload } = action;

  if (typeof reducers[type] === 'function') {
    return reducers[type](stateData, payload);
  }

  return stateData;
};

export default output;
