import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { RootAction } from '../../store/actions';

export const useAppDispatch = (): Dispatch<RootAction> =>
  useDispatch<Dispatch<RootAction>>();
