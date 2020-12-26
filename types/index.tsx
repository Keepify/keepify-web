import { NextPageContext } from 'next';
import { Store as IStore } from 'redux';
import { User } from 'types/user';

export interface PageContext extends NextPageContext {
  store: IStore<RootState, Actions>;
}

export type Actions = { type: 'SET_USER_INFO'; payload: User } | { type: 'LOGOUT_USER' };

export interface RootState {
  user: User;
}

export type LatLng = {
  latitude: number;
  longitude: number;
};
