import { app } from 'electron';
import i18next from 'i18next';
import { createElement } from 'react';

import { render } from '../packages/null-react-renderer/dist/esm';
import { performElectronStartup } from './app/main/app';
import {
  mergePersistableValues,
  watchAndPersistChanges,
} from './app/main/data';
import { setUserDataDirectory } from './app/main/dev';
import { initializeI18next } from './common/i18n/initializeI18next';
import { setupDeepLinks, processDeepLinksInArgs } from './deepLinks/main';
import { setupDownloads } from './downloads/main';
import { setupMainErrorHandling } from './errors';
import AppRoot from './mainProcess/components/AppRoot';
import { setupNavigation } from './navigation/main';
import { setupNotifications } from './notifications/main';
import { setupScreenSharing } from './screenSharing/main';
import { setupServers } from './servers/main';
import { setupSpellChecking } from './spellChecking/main';
import { createMainReduxStore } from './store';
import {
  createRootWindow,
  showRootWindow,
  exportLocalStorage,
} from './ui/main/rootWindow';
import { attachGuestWebContentsEvents } from './ui/main/serverView';
import { setupUpdates } from './updates/main';
import { setupPowerMonitor } from './userPresence/main';

const start = async (): Promise<void> => {
  setUserDataDirectory();
  setupMainErrorHandling();
  performElectronStartup();

  const reduxStore = createMainReduxStore();

  await app.whenReady();

  reduxStore.dispatch({
    type: 'app/set-info',
    payload: {
      name: app.getName(),
      version: app.getVersion(),
      path: app.getAppPath(),
      locale: app.getLocale(),
      platform: process.platform,
    },
  });

  const localStorage = await exportLocalStorage();
  await mergePersistableValues(localStorage);
  await setupServers(localStorage);
  await initializeI18next(app.getLocale());

  render(createElement(AppRoot, { reduxStore, i18n: i18next }));

  createRootWindow();
  attachGuestWebContentsEvents();
  await showRootWindow();

  // React DevTools is currently incompatible with Electron 10
  // if (process.env.NODE_ENV === 'development') {
  //   installDevTools();
  // }

  setupNotifications();
  setupScreenSharing();

  await setupSpellChecking();

  setupDeepLinks();
  await setupNavigation();
  setupPowerMonitor();
  await setupUpdates();
  setupDownloads();

  watchAndPersistChanges();

  await processDeepLinksInArgs();
};

if (require.main === module) {
  start();
}
