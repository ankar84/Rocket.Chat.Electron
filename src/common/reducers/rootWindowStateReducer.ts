import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import { WindowState } from '../../ui/common';
import * as appActions from '../actions/appActions';
import { ROOT_WINDOW_STATE_CHANGED } from '../actions/uiActions';

type RootWindowStateAction =
  | ActionOf<typeof ROOT_WINDOW_STATE_CHANGED>
  | ActionOf<typeof appActions.settingsLoaded.type>;

export const rootWindowState: Reducer<WindowState, RootWindowStateAction> = (
  state = {
    focused: true,
    visible: true,
    maximized: false,
    minimized: false,
    fullscreen: false,
    normal: true,
    bounds: {
      x: undefined,
      y: undefined,
      width: 1000,
      height: 600,
    },
  },
  action
) => {
  switch (action.type) {
    case ROOT_WINDOW_STATE_CHANGED:
      return action.payload;

    case appActions.settingsLoaded.type: {
      const { rootWindowState = state } = action.payload;
      return rootWindowState;
    }

    default:
      return state;
  }
};
