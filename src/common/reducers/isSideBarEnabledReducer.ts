import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import * as appActions from '../actions/appActions';
import { MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED } from '../actions/uiActions';

type IsSideBarEnabledAction =
  | ActionOf<typeof MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED>
  | ActionOf<typeof appActions.settingsLoaded.type>;

export const isSideBarEnabled: Reducer<boolean, IsSideBarEnabledAction> = (
  state = true,
  action
) => {
  switch (action.type) {
    case MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED:
      return action.payload;

    case appActions.settingsLoaded.type: {
      const { isSideBarEnabled = state } = action.payload;
      return isSideBarEnabled;
    }

    default:
      return state;
  }
};
