import { combineReducers } from 'redux';

import user from './user';
import order from './order';

export default combineReducers({
  user,
  order,
});
