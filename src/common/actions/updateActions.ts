import { createAction } from '@reduxjs/toolkit';

export const downloadFailed = createAction(
  'update/downloadFailed',
  (error: Error) => ({
    payload: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  })
);

export const skipped = createAction('update/skipped');
