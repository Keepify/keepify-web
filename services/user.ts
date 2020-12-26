import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import setAuthToken from 'helpers/token';
import { User } from 'types/user';
import cookie from 'js-cookie';

export async function loginUser(email: string, password: string) {
  try {
    const { data } = await axios.post<{ user: User; token: string }>(`${API_DOMAIN}/login`, {
      email,
      password,
    });

    // set JWT token to axios header
    setAuthToken(`Bearer ${data.token}`);

    cookie.set('_ap.ut', data.token, { expires: 365 });

    return data.user;
  } catch (e) {
    throw e;
  }
}

export async function signupUser(email: string, password: string, fname: string, lname: string) {
  try {
    const { data } = await axios.post<{ user: User; token: string }>(`${API_DOMAIN}/signup`, {
      email,
      password,
      fname,
      lname,
    });

    // set JWT token to axios header
    setAuthToken(`Bearer ${data.token}`);

    cookie.set('_ap.ut', data.token, { expires: 365 });

    return data.user;
  } catch (e) {
    throw e;
  }
}

export async function getUser() {
  try {
    const { data } = await axios.get<{ user: User }>(`${API_DOMAIN}/users`);

    return data.user;
  } catch (e) {
    throw e;
  }
}
