import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
