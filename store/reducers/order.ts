import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction } from 'redux';

export const SET_START_TIME = 'SET_START_TIME';
export const SET_END_TIME = 'SET_END_TIME';
export const SET_ITEM = 'SET_ITEM';
export const ADD_ITEM = 'ADD_ITEM';
export const MINUS_ITEM = 'MINUS_ITEM';
export const CLEAR_ORDER = 'CLEAR_ORDER';

const initialState = {
  startTime: null,
  endTime: null,
  items: 0,
};

export default function userReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_START_TIME:
      return { ...state, startTime: action.payload };
    case SET_END_TIME:
      return { ...state, endTime: action.payload };
    case SET_ITEM:
      return { ...state, items: action.payload };
    case ADD_ITEM:
      return { ...state, items: state.items + 1 };
    case MINUS_ITEM:
      if (state.items > 0) return { ...state, items: state.items - 1 };
      return state;
    default:
      return state;
  }
}
