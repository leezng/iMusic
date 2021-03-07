import { setPreferences } from 'renderer/utils/rpc';

export type PreferenceState = Record<string, string | number | boolean>;

const state: PreferenceState = {};

const reducers = {
  setPreferences: (state: PreferenceState, payload: PreferenceState) => {
    const newValues = {
      ...state,
      ...payload,
    };
    setPreferences(newValues);
    return newValues;
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
