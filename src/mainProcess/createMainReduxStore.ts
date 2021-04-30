import { configureStore } from '@reduxjs/toolkit';
import { forwardToRenderers } from '@rocket.chat/redux-over-electron';
import { app } from 'electron';
import { DeepPartial, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { catchLastAction } from '../store/catchLastAction';
import { RootAction } from '../store/rootAction';
import { rootReducer, RootState } from '../store/rootReducer';
import { rootSaga } from './sagas';

const getPreloadedState = async (): Promise<DeepPartial<RootState>> => ({
  app: {
    name: app.getName(),
    version: app.getVersion(),
    path: app.getAppPath(),
    locale: app.getLocale(),
    platform: process.platform,
  },
});

export const createMainReduxStore = async (): Promise<
  Store<RootState, RootAction>
> => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: await getPreloadedState(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(catchLastAction)
        .concat(sagaMiddleware)
        .concat(forwardToRenderers),
    devTools: false,
  });

  sagaMiddleware.run(rootSaga);

  return store;
};
