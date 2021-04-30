import { Reducer } from 'redux';

import { ActionOf } from '../../store/rootAction';
import {
  CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED,
  SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED,
  SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED,
} from '../actions/navigationActions';
import { SCREEN_SHARING_DIALOG_DISMISSED } from '../actions/screenSharingActions';
import {
  ABOUT_DIALOG_DISMISSED,
  MENU_BAR_ABOUT_CLICKED,
  WEBVIEW_SCREEN_SHARING_SOURCE_REQUESTED,
  WEBVIEW_SCREEN_SHARING_SOURCE_RESPONDED,
} from '../actions/uiActions';
import * as updateCheckActions from '../actions/updateCheckActions';
import * as updateDialogActions from '../actions/updateDialogActions';

type OpenDialogAction =
  | ActionOf<typeof ABOUT_DIALOG_DISMISSED>
  | ActionOf<typeof CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED>
  | ActionOf<typeof MENU_BAR_ABOUT_CLICKED>
  | ActionOf<typeof SCREEN_SHARING_DIALOG_DISMISSED>
  | ActionOf<typeof SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED>
  | ActionOf<typeof SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED>
  | ActionOf<typeof updateDialogActions.dismissed.type>
  | ActionOf<typeof updateDialogActions.installButtonClicked.type>
  | ActionOf<typeof updateDialogActions.remindUpdateLaterClicked.type>
  | ActionOf<typeof updateDialogActions.skipUpdateClicked.type>
  | ActionOf<typeof updateCheckActions.updateAvailable.type>
  | ActionOf<typeof WEBVIEW_SCREEN_SHARING_SOURCE_REQUESTED>
  | ActionOf<typeof WEBVIEW_SCREEN_SHARING_SOURCE_RESPONDED>;

export const openDialog: Reducer<string | null, OpenDialogAction> = (
  state = null,
  action
) => {
  switch (action.type) {
    case MENU_BAR_ABOUT_CLICKED:
      return 'about';

    case WEBVIEW_SCREEN_SHARING_SOURCE_REQUESTED:
      return 'screen-sharing';

    case updateCheckActions.updateAvailable.type:
      return 'update';

    case CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED:
      return 'select-client-certificate';

    case ABOUT_DIALOG_DISMISSED:
    case SCREEN_SHARING_DIALOG_DISMISSED:
    case WEBVIEW_SCREEN_SHARING_SOURCE_RESPONDED:
    case SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED:
    case SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED:
    case updateDialogActions.dismissed.type:
    case updateDialogActions.skipUpdateClicked.type:
    case updateDialogActions.remindUpdateLaterClicked.type:
    case updateDialogActions.installButtonClicked.type:
      return null;

    default:
      return state;
  }
};
