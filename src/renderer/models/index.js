import { createStore, combineReducers } from 'redux';
import user from './user';
import player from './player';
import preferences from './preferences';

const globalModels = combineReducers({
  user,
  player,
  preferences,
});

export default createStore(globalModels);
