import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import * as appActions from '../actions/appActions';
import { MENU_BAR_TOGGLE_IS_TRAY_ICON_ENABLED_CLICKED } from '../actions/uiActions';

type IsTrayIconEnabledAction =
  | ActionOf<typeof MENU_BAR_TOGGLE_IS_TRAY_ICON_ENABLED_CLICKED>
  | ActionOf<typeof appActions.settingsLoaded.type>
  | ActionOf<typeof appActions.infoSet.type>;

export const isTrayIconEnabled: Reducer<boolean, IsTrayIconEnabledAction> = (
  state = true,
  action
) => {
  switch (action.type) {
    case appActions.infoSet.type: {
      const { platform } = action.payload;
      return platform !== 'linux';
    }

    case MENU_BAR_TOGGLE_IS_TRAY_ICON_ENABLED_CLICKED: {
      return action.payload;
    }

    case appActions.settingsLoaded.type: {
      const { isTrayIconEnabled = state } = action.payload;
      return isTrayIconEnabled;
    }

    default:
      return state;
  }
};
