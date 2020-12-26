import { User } from 'types/user';

export const SET_USER_INFO = 'SET_USER_INFO';
export const LOGOUT_USER = 'LOGOUT_USER';

export function setUserInfo(user: User) {
  return {
    type: SET_USER_INFO,
    payload: user,
  };
}

export function logoutUser() {
  return { type: LOGOUT_USER };
}
