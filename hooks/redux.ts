import { useSelector } from 'react-redux';
import { RootState } from 'types';

export const useUserInfo = () => useSelector((state: RootState) => state.user);
export const useOrderInfo = () => useSelector((state: RootState) => state.order);
