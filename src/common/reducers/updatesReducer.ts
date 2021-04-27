import { createReducer } from '@reduxjs/toolkit';

import * as appActions from '../actions/appActions';
import * as updateActions from '../actions/updateActions';
import * as updateCheckActions from '../actions/updateCheckActions';
import * as updatesActions from '../actions/updatesActions';

type State = {
  allowed: boolean;
  settings: {
    editable: boolean;
    enabled: boolean;
    checkOnStartup: boolean;
    skippedVersion: string | null;
  };
  updateCheck?:
    | {
        status: 'pending';
      }
    | {
        status: 'fulfilled';
        newVersion: string | null;
      }
    | {
        status: 'rejected';
        error: Error;
      };
};

export const updatesReducer = createReducer<State>(
  {
    allowed: true,
    settings: {
      editable: true,
      enabled: true,
      checkOnStartup: true,
      skippedVersion: null,
    },
    updateCheck: undefined,
  },
  (builder) =>
    builder
      .addCase(appActions.settingsLoaded, (state, action) => {
        if (action.payload.doCheckForUpdatesOnStartup !== undefined) {
          state.settings.checkOnStartup =
            action.payload.doCheckForUpdatesOnStartup;
        }

        if (action.payload.isEachUpdatesSettingConfigurable !== undefined) {
          state.settings.editable =
            action.payload.isEachUpdatesSettingConfigurable;
        }

        if (action.payload.isUpdatingEnabled !== undefined) {
          state.settings.enabled = action.payload.isUpdatingEnabled;
        }

        if (action.payload.skippedUpdateVersion !== undefined) {
          state.settings.skippedVersion = action.payload.skippedUpdateVersion;
        }
      })
      .addCase(updatesActions.ready, (state, action) => {
        state.allowed = action.payload.isUpdatingAllowed;
        state.settings.checkOnStartup =
          action.payload.doCheckForUpdatesOnStartup;
        state.settings.editable =
          action.payload.isEachUpdatesSettingConfigurable;
        state.settings.enabled = action.payload.isUpdatingEnabled;
        state.settings.skippedVersion = action.payload.skippedUpdateVersion;
      })
      .addCase(updatesActions.checkOnStartupToggled, (state, action) => {
        state.settings.checkOnStartup = action.payload;
      })
      .addCase(updateCheckActions.started, (state) => {
        state.updateCheck = {
          status: 'pending',
        };
      })
      .addCase(updateCheckActions.updateAvailable, (state, action) => {
        state.updateCheck = {
          status: 'fulfilled',
          newVersion: action.payload,
        };
      })
      .addCase(updateCheckActions.updateNotAvailable, (state) => {
        state.updateCheck = {
          status: 'fulfilled',
          newVersion: null,
        };
      })
      .addCase(updateCheckActions.failed, (state, action) => {
        state.updateCheck = {
          status: 'rejected',
          error: action.payload,
        };
      })
      .addCase(updateActions.skipped, (state) => {
        if (state.updateCheck?.status === 'fulfilled') {
          state.settings.skippedVersion = state.updateCheck.newVersion;
        }
      })
);
