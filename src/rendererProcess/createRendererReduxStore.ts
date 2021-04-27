import { configureStore } from '@reduxjs/toolkit';
import {
  forwardToMain,
  getPreloadedState,
} from '@rocket.chat/redux-over-electron';
import { Store } from 'redux';

import { catchLastAction } from '../store/catchLastAction';
import { RootAction } from '../store/rootAction';
import { rootReducer, RootState } from '../store/rootReducer';

export const createRendererReduxStore = async (): Promise<
  Store<RootState, RootAction>
> =>
  configureStore({
    reducer: rootReducer,
    preloadedState: await getPreloadedState(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(forwardToMain).concat(catchLastAction),
    devTools: true,
  });
