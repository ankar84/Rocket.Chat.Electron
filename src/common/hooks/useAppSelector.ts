import { createSelectorHook } from 'react-redux';

import { RootAction } from '../../store/rootAction';
import { RootState } from '../../store/rootReducer';

export const useAppSelector = createSelectorHook<RootState, RootAction>();
