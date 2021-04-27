import { createDispatchHook } from 'react-redux';

import { RootAction } from '../../store/rootAction';
import { RootState } from '../../store/rootReducer';

export const useAppDispatch = createDispatchHook<RootState, RootAction>();
