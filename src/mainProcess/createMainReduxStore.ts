import { configureStore } from '@reduxjs/toolkit';
import { forwardToRenderers } from '@rocket.chat/redux-over-electron';
import { Store } from 'redux';

import { catchLastAction } from '../store/catchLastAction';
import { RootAction } from '../store/rootAction';
import { rootReducer, RootState } from '../store/rootReducer';
import { getPreloadedState } from './getPreloadedState';

export const createMainReduxStore = async (): Promise<
  Store<RootState, RootAction>
> =>
  configureStore({
    reducer: rootReducer,
    preloadedState: await getPreloadedState(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(catchLastAction).concat(forwardToRenderers),
    devTools: false,
  });
