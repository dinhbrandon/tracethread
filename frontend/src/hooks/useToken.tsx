import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useToken = () => {
  return useSelector((state: RootState) => state.auth.token);
};