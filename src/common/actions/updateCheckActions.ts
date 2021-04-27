import { createAction } from '@reduxjs/toolkit';

export const requested = createAction('updateCheck/requested');

export const started = createAction('updateCheck/started');

export const updateAvailable = createAction(
  'updateCheck/updateAvailable',
  (version: string) => ({
    payload: version,
  })
);

export const updateNotAvailable = createAction(
  'updateCheck/updateNotAvailable'
);

export const failed = createAction('updateCheck/failed', (error: Error) => ({
  payload: {
    name: error.name,
    message: error.message,
    stack: error.stack,
  },
}));
