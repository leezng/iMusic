export interface UserState {
  id: string;
  name: string;
  isLocal: boolean;
  profile: {
    nickname: string;
    signature: string;
    avatarUrl: string;
  } | null;
}

const state: UserState = {
  id: '',
  name: 'LOCAL',
  isLocal: true,
  profile: null,
};

const reducers = {
  setUser: (state: UserState, payload) => {
    return {
      ...state,
      id: payload.id || '',
      name: payload.name || 'LOCAL',
      profile: payload.profile,
      isLocal: payload.isLocal,
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
