import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import * as appActions from '../actions/appActions';
import { MENU_BAR_TOGGLE_IS_MENU_BAR_ENABLED_CLICKED } from '../actions/uiActions';

type IsMenuBarEnabledAction =
  | ActionOf<typeof MENU_BAR_TOGGLE_IS_MENU_BAR_ENABLED_CLICKED>
  | ActionOf<typeof appActions.settingsLoaded.type>;

export const isMenuBarEnabled: Reducer<boolean, IsMenuBarEnabledAction> = (
  state = true,
  action
) => {
  switch (action.type) {
    case MENU_BAR_TOGGLE_IS_MENU_BAR_ENABLED_CLICKED: {
      return action.payload;
    }

    case appActions.settingsLoaded.type: {
      const { isMenuBarEnabled = state } = action.payload;
      return isMenuBarEnabled;
    }

    default:
      return state;
  }
};
