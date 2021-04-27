import { createStructuredSelector } from 'reselect';

import { RootState } from '../store/rootReducer';
import { PersistableValues } from './PersistableValues';

export const selectPersistableValues = createStructuredSelector<
  RootState,
  PersistableValues
>({
  currentView: ({ currentView }) => currentView,
  downloads: ({ downloads }) => downloads,
  isMenuBarEnabled: ({ isMenuBarEnabled }) => isMenuBarEnabled,
  isShowWindowOnUnreadChangedEnabled: ({
    isShowWindowOnUnreadChangedEnabled,
  }) => isShowWindowOnUnreadChangedEnabled,
  isSideBarEnabled: ({ isSideBarEnabled }) => isSideBarEnabled,
  isTrayIconEnabled: ({ isTrayIconEnabled }) => isTrayIconEnabled,
  rootWindowState: ({ rootWindowState }) => rootWindowState,
  servers: ({ servers }) => servers,
  trustedCertificates: ({ trustedCertificates }) => trustedCertificates,
  externalProtocols: ({ externalProtocols }) => externalProtocols,
  isEachUpdatesSettingConfigurable: ({ updates }) => updates.settings.editable,
  doCheckForUpdatesOnStartup: ({ updates }) => updates.settings.checkOnStartup,
  isUpdatingEnabled: ({ updates }) => updates.settings.enabled,
  skippedUpdateVersion: ({ updates }) => updates.settings.skippedVersion,
});
