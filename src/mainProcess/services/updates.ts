import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { app } from 'electron';
import { autoUpdater } from 'electron-updater';

import * as updateActions from '../../common/actions/updateActions';
import * as updateCheckActions from '../../common/actions/updateCheckActions';
import * as updatesActions from '../../common/actions/updatesActions';
import { AppLevelUpdateConfiguration } from '../../common/types/AppLevelUpdateConfiguration';
import { UpdateConfiguration } from '../../common/types/UpdateConfiguration';
import { UserLevelUpdateConfiguration } from '../../common/types/UserLevelUpdateConfiguration';
import { dispatch, select } from '../../store';
import { RootState } from '../../store/rootReducer';
import {
  askUpdateInstall,
  AskUpdateInstallResponse,
  warnAboutInstallUpdateLater,
  warnAboutUpdateDownload,
  warnAboutUpdateSkipped,
} from '../../ui/main/dialogs';

const readJsonObject = async (
  filePath: string
): Promise<Record<string, unknown>> => {
  try {
    const content = await fsPromises.readFile(filePath, 'utf8');
    const json = JSON.parse(content);

    return json && typeof json === 'object' && !Array.isArray(json) ? json : {};
  } catch (error) {
    return {};
  }
};

const readAppJsonObject = async (
  basename: string
): Promise<Record<string, unknown>> => {
  const filePath = join(
    app.getAppPath(),
    app.getAppPath().endsWith('app.asar') ? '..' : '.',
    basename
  );
  return readJsonObject(filePath);
};

const readUserJsonObject = async (
  basename: string
): Promise<Record<string, unknown>> => {
  const filePath = join(app.getPath('userData'), basename);
  return readJsonObject(filePath);
};

const loadAppConfiguration = async (): Promise<AppLevelUpdateConfiguration> =>
  readAppJsonObject('update.json');

const loadUserConfiguration = async (): Promise<UserLevelUpdateConfiguration> =>
  readUserJsonObject('update.json');

export const mergeConfigurations = (
  defaultConfiguration: UpdateConfiguration,
  appConfiguration: AppLevelUpdateConfiguration,
  userConfiguration: UserLevelUpdateConfiguration
): UpdateConfiguration => {
  const configuration = {
    ...defaultConfiguration,
    ...(typeof appConfiguration.forced === 'boolean' && {
      isEachUpdatesSettingConfigurable: !appConfiguration.forced,
    }),
    ...(typeof appConfiguration.canUpdate === 'boolean' && {
      isUpdatingEnabled: appConfiguration.canUpdate,
    }),
    ...(typeof appConfiguration.autoUpdate === 'boolean' && {
      doCheckForUpdatesOnStartup: appConfiguration.autoUpdate,
    }),
    ...(typeof appConfiguration.skip === 'string' && {
      skippedUpdateVersion: appConfiguration.skip,
    }),
  };

  if (
    typeof userConfiguration.autoUpdate === 'boolean' &&
    (configuration.isEachUpdatesSettingConfigurable ||
      typeof appConfiguration.autoUpdate === 'undefined')
  ) {
    configuration.doCheckForUpdatesOnStartup = userConfiguration.autoUpdate;
  }

  if (
    typeof userConfiguration.skip === 'string' &&
    (configuration.isEachUpdatesSettingConfigurable ||
      typeof appConfiguration.skip === 'undefined')
  ) {
    configuration.skippedUpdateVersion = userConfiguration.skip;
  }

  return configuration;
};

const loadConfiguration = async (): Promise<UpdateConfiguration> => {
  const defaultConfiguration = select(({ updates }: RootState) => ({
    isUpdatingAllowed:
      (process.platform === 'linux' && !!process.env.APPIMAGE) ||
      (process.platform === 'win32' && !process.windowsStore) ||
      (process.platform === 'darwin' && !process.mas),
    isEachUpdatesSettingConfigurable: true,
    isUpdatingEnabled: updates.settings.enabled,
    doCheckForUpdatesOnStartup: updates.settings.checkOnStartup,
    skippedUpdateVersion: updates.settings.skippedVersion,
  }));
  const appConfiguration = await loadAppConfiguration();
  const userConfiguration = await loadUserConfiguration();

  const configuration = mergeConfigurations(
    defaultConfiguration,
    appConfiguration,
    userConfiguration
  );

  dispatch(updatesActions.ready(configuration));

  return configuration;
};

const checkForUpdates = async (): Promise<void> => {
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    dispatch(updateCheckActions.failed(error));
  }
};

const skipUpdate = async (): Promise<void> => {
  await warnAboutUpdateSkipped();
  dispatch(updateActions.skipped());
};

const downloadUpdate = async (): Promise<void> => {
  await warnAboutUpdateDownload();

  try {
    await autoUpdater.downloadUpdate();
  } catch (error) {
    dispatch(updateActions.downloadFailed(error));
  }
};

export const updates = {
  checkForUpdates,
  skipUpdate,
  downloadUpdate,
};

export const setupUpdates = async (): Promise<void> => {
  autoUpdater.autoDownload = false;

  const {
    isUpdatingAllowed,
    isUpdatingEnabled,
    doCheckForUpdatesOnStartup,
  } = await loadConfiguration();

  if (!isUpdatingAllowed || !isUpdatingEnabled) {
    return;
  }

  autoUpdater.addListener('checking-for-update', () => {
    dispatch(updateCheckActions.started());
  });

  autoUpdater.addListener('update-available', ({ version }) => {
    const skippedUpdateVersion = select(
      ({ updates }) => updates.settings.skippedVersion
    );
    if (skippedUpdateVersion === version) {
      dispatch(updateCheckActions.updateNotAvailable());
      return;
    }

    dispatch(updateCheckActions.updateAvailable(version));
  });

  autoUpdater.addListener('update-not-available', () => {
    dispatch(updateCheckActions.updateNotAvailable());
  });

  autoUpdater.addListener('update-downloaded', async () => {
    const response = await askUpdateInstall();

    if (response === AskUpdateInstallResponse.INSTALL_LATER) {
      await warnAboutInstallUpdateLater();
      return;
    }

    try {
      app.removeAllListeners('window-all-closed');
      autoUpdater.quitAndInstall(true, true);
    } catch (error) {
      dispatch(updateCheckActions.failed(error));
    }
  });

  autoUpdater.addListener('error', (error) => {
    dispatch(updateCheckActions.failed(error));
  });

  if (doCheckForUpdatesOnStartup) {
    checkForUpdates();
  }
};
