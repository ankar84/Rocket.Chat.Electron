import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import * as appActions from '../actions/appActions';
import { MENU_BAR_TOGGLE_IS_SHOW_WINDOW_ON_UNREAD_CHANGED_ENABLED_CLICKED } from '../actions/uiActions';

type IsShowWindowOnUnreadChangedEnabledAction =
  | ActionOf<
      typeof MENU_BAR_TOGGLE_IS_SHOW_WINDOW_ON_UNREAD_CHANGED_ENABLED_CLICKED
    >
  | ActionOf<typeof appActions.settingsLoaded.type>;

export const isShowWindowOnUnreadChangedEnabled: Reducer<
  boolean,
  IsShowWindowOnUnreadChangedEnabledAction
> = (state = false, action) => {
  switch (action.type) {
    case MENU_BAR_TOGGLE_IS_SHOW_WINDOW_ON_UNREAD_CHANGED_ENABLED_CLICKED:
      return action.payload;

    case appActions.settingsLoaded.type: {
      const { isShowWindowOnUnreadChangedEnabled = state } = action.payload;
      return isShowWindowOnUnreadChangedEnabled;
    }

    default:
      return state;
  }
};
