import {
  SET_START_TIME,
  SET_END_TIME,
  ADD_ITEM,
  MINUS_ITEM,
  CLEAR_ORDER,
  SET_ITEM,
} from 'store/reducers/order';

export function setStartTime(startTime: string) {
  return {
    type: SET_START_TIME,
    payload: startTime,
  };
}

export function setEndTime(endTime: string) {
  return {
    type: SET_END_TIME,
    payload: endTime,
  };
}

export function setItems(items: number) {
  return {
    type: SET_ITEM,
    payload: items,
  };
}

export function addItem() {
  return { type: ADD_ITEM };
}

export function minusItem() {
  return { type: MINUS_ITEM };
}

export function clearOrder() {
  return { type: CLEAR_ORDER };
}
