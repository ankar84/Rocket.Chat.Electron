import { app } from 'electron';
import { DeepPartial } from 'redux';

import { RootState } from '../store/rootReducer';

export const getPreloadedState = async (): Promise<DeepPartial<RootState>> => ({
  app: {
    name: app.getName(),
    version: app.getVersion(),
    path: app.getAppPath(),
    locale: app.getLocale(),
    platform: process.platform,
  },
});
