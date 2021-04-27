import { AnyAction, combineReducers, Reducer } from 'redux';

import { appReducer } from '../common/reducers/appReducer';
import { currentView } from '../common/reducers/currentViewReducer';
import { downloads } from '../common/reducers/downloadsReducer';
import { isMenuBarEnabled } from '../common/reducers/isMenuBarEnabledReducer';
import { isMessageBoxFocused } from '../common/reducers/isMessageBoxFocusedReducer';
import { isShowWindowOnUnreadChangedEnabled } from '../common/reducers/isShowWindowOnUnreadChangedEnabledReducer';
import { isSideBarEnabled } from '../common/reducers/isSideBarEnabledReducer';
import { isTrayIconEnabled } from '../common/reducers/isTrayIconEnabledReducer';
import {
  clientCertificates,
  externalProtocols,
  trustedCertificates,
} from '../common/reducers/navigationReducers';
import { openDialog } from '../common/reducers/openDialogReducer';
import { rootWindowIcon } from '../common/reducers/rootWindowIconReducer';
import { rootWindowState } from '../common/reducers/rootWindowStateReducer';
import { servers } from '../common/reducers/serversReducers';
import { updatesReducer } from '../common/reducers/updatesReducer';

const _rootReducer = combineReducers({
  app: appReducer,
  updates: updatesReducer,
  clientCertificates,
  currentView,
  downloads,
  externalProtocols,
  isMenuBarEnabled,
  isMessageBoxFocused,
  isShowWindowOnUnreadChangedEnabled,
  isSideBarEnabled,
  isTrayIconEnabled,
  openDialog,
  rootWindowIcon,
  rootWindowState,
  servers,
  trustedCertificates,
});

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer: Reducer<
  ReturnType<typeof _rootReducer>,
  AnyAction
> = _rootReducer;
