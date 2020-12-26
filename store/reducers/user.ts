import { LOGOUT_USER, SET_USER_INFO } from 'actions/user';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

const initialState = {
  userInfo: null,
  isLogin: false,
};

export default function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.user };
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload, isLogin: true };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
