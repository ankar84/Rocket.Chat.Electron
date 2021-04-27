import { createStoreHook } from 'react-redux';

import { RootAction } from '../../store/rootAction';
import { RootState } from '../../store/rootReducer';

export const useAppStore = createStoreHook<RootState, RootAction>();
