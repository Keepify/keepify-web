import axios from 'axios';
import { API_DOMAIN } from 'constants/api';
import setAuthToken from 'helpers/token';
import { User } from 'types/user';
import cookie from 'js-cookie';
import NProgress from 'nprogress';

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
    const { data } = await axios.get<{ me: User }>(`${API_DOMAIN}/users/me`);

    return data.me;
  } catch (e) {
    throw e;
  }
}

export async function updateUser(user: Partial<User>) {
  try {
    const { data } = await axios.put(`${API_DOMAIN}/users/me`, user);

    return data;
  } catch (e) {
    throw e;
  }
}

export async function uploadProfileImg(file) {
  try {
    const body = new FormData();
    body.append('image', file);

    const config = {
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        NProgress.set(percentCompleted * 0.01);
      },
      headers: {
        'content-type': 'application/json',
      },
    };

    const { data } = await axios.post(`${API_DOMAIN}/media/image`, body, config);

    return data;
  } catch (e) {
    throw e;
  }
}
