import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import { RootWindowIcon } from '../../ui/common';
import { ROOT_WINDOW_ICON_CHANGED } from '../actions/uiActions';

type RootWindowIconAction = ActionOf<typeof ROOT_WINDOW_ICON_CHANGED>;

export const rootWindowIcon: Reducer<
  RootWindowIcon | null,
  RootWindowIconAction
> = (state = null, action) => {
  switch (action.type) {
    case ROOT_WINDOW_ICON_CHANGED: {
      return action.payload;
    }

    default:
      return state;
  }
};
