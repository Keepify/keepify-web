import { LOGOUT_USER, SET_USER_INFO, UPDATE_USER_INFO } from 'store/reducers/user';
import { User } from 'types/user';

export function setUserInfo(user: User) {
  return {
    type: SET_USER_INFO,
    payload: user,
  };
}

export function logoutUser() {
  return { type: LOGOUT_USER };
}

export function updateUserInfo(user: Partial<User>) {
  return {
    type: UPDATE_USER_INFO,
    payload: user,
  };
}
