import { createAction } from '@reduxjs/toolkit';

import { PersistableValues } from '../../app/PersistableValues';
import { AppInfo } from '../types/AppInfo';

export const infoSet = createAction('app/infoSet', (appInfo: AppInfo) => ({
  payload: appInfo,
}));

export const settingsLoaded = createAction(
  'app/settingsLoaded',
  (settings: Partial<PersistableValues>) => ({ payload: settings })
);

export const errorThrown = createAction('app/errorThrown', (error: Error) => ({
  payload: {
    message: error.message,
    stack: error.stack,
    name: error.name,
  },
  error: true,
}));

export const rejectionUnhandled = createAction(
  'app/rejectionUnhandled',
  (reason: any) => ({
    payload: reason,
    meta: {
      local: 'local' as const,
    },
  })
);
