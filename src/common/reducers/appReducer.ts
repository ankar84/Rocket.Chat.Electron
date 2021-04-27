import { createReducer } from '@reduxjs/toolkit';

import * as appActions from '../actions/appActions';
import { AppInfo } from '../types/AppInfo';

type State = {
  [Key in keyof AppInfo]: AppInfo[Key] | null;
};

export const appReducer = createReducer<State>(
  {
    name: null,
    locale: null,
    path: null,
    platform: null,
    version: null,
  },
  (builder) =>
    builder.addCase(appActions.infoSet, (_state, action) => action.payload)
);
