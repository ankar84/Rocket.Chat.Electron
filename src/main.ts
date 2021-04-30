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
import { setupMainErrorHandling } from './errors';
import AppRoot from './mainProcess/components/AppRoot';
import { createMainReduxStore } from './mainProcess/createMainReduxStore';
import {
  setupDeepLinks,
  processDeepLinksInArgs,
} from './mainProcess/services/deepLinks';
import { setupDownloads } from './mainProcess/services/downloads';
import { setupNavigation } from './mainProcess/services/navigation';
import { setupPowerMonitor } from './mainProcess/services/powerMonitor';
import { setupScreenSharing } from './mainProcess/services/screenSharing';
import { setupServers } from './mainProcess/services/servers';
import { setupSpellChecking } from './mainProcess/services/spellChecking';
import { setupUpdates } from './mainProcess/services/updates';
import { setupNotifications } from './notifications/main';
import { setReduxStore } from './store';
import {
  createRootWindow,
  showRootWindow,
  exportLocalStorage,
} from './ui/main/rootWindow';
import { attachGuestWebContentsEvents } from './ui/main/serverView';

const start = async (): Promise<void> => {
  setUserDataDirectory();
  setupMainErrorHandling();
  performElectronStartup();

  const reduxStore = await createMainReduxStore();
  setReduxStore(reduxStore);

  await app.whenReady();

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
