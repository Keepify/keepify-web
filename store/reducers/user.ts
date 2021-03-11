import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

export const SET_USER_INFO = 'SET_USER_INFO';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';

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
    case UPDATE_USER_INFO:
      return { ...state, userInfo: { ...state.userInfo, ...action.payload } };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
