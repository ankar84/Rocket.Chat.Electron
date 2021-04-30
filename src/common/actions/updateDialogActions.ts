import { createAction } from '@reduxjs/toolkit';

export const dismissed = createAction('updateDialog/dismissed');

export const installButtonClicked = createAction(
  'updateDialog/installButtonClicked'
);

export const remindUpdateLaterClicked = createAction(
  'updateDialog/remindUpdateLaterClicked'
);

export const skipUpdateClicked = createAction('updateDialog/skipUpdateClicked');
