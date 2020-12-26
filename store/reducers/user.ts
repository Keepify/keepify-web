import { LOGOUT_USER, SET_USER_INFO } from 'actions/user';
import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

const initialState = {
  user: null,
};

export default function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload.user };
    case SET_USER_INFO:
      return { ...state, user: action.payload };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}
