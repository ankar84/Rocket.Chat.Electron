import { app, Menu, Tray } from 'electron';
import { TFunction } from 'i18next';
import { ReactElement, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Server } from '../../../servers/common';
import { select } from '../../../store';
import { RootState } from '../../../store/rootReducer';
import { getAppIconPath, getTrayIconPath } from '../../../ui/main/icons';
import { getRootWindow } from '../../../ui/main/rootWindow';
import { selectGlobalBadge } from '../../../ui/selectors';

const warnStillRunning = (trayIcon: Tray, t: TFunction): void => {
  if (process.platform !== 'win32') {
    return;
  }

  trayIcon.displayBalloon({
    icon: getAppIconPath({ platform: process.platform }),
    title: t('tray.balloon.stillRunning.title', { appName: app.name }),
    content: t('tray.balloon.stillRunning.content', { appName: app.name }),
  });
};

const updateTrayIconToolTip = (
  trayIcon: Tray,
  globalBadge: Server['badge'],
  t: TFunction
): void => {
  if (globalBadge === '•') {
    trayIcon.setToolTip(t('tray.tooltip.unreadMessage', { appName: app.name }));
    return;
  }

  if (Number.isInteger(globalBadge)) {
    trayIcon.setToolTip(
      t('tray.tooltip.unreadMention', { appName: app.name, count: globalBadge })
    );
    return;
  }

  trayIcon.setToolTip(t('tray.tooltip.noUnreadMessage', { appName: app.name }));
};

const updateTrayIconTitle = (
  trayIcon: Tray,
  globalBadge: Server['badge']
): void => {
  const title = Number.isInteger(globalBadge) ? String(globalBadge) : '';
  trayIcon.setTitle(title);
};

const updateTrayIconImage = (trayIcon: Tray, badge: Server['badge']): void => {
  const image = getTrayIconPath({
    platform: process.platform,
    badge,
  });
  trayIcon.setImage(image);
};

const selectIsRootWindowVisible = ({
  rootWindowState: { visible },
}: RootState): boolean => visible;

const createTrayIcon = (): Tray => {
  const image = getTrayIconPath({
    platform: process.platform,
    badge: undefined,
  });

  const trayIcon = new Tray(image);

  if (process.platform !== 'darwin') {
    trayIcon.addListener('click', async () => {
      const isRootWindowVisible = select(selectIsRootWindowVisible);
      const browserWindow = await getRootWindow();

      if (isRootWindowVisible) {
        browserWindow.hide();
        return;
      }

      browserWindow.show();
    });
  }

  trayIcon.addListener('balloon-click', async () => {
    const isRootWindowVisible = select(selectIsRootWindowVisible);
    const browserWindow = await getRootWindow();

    if (isRootWindowVisible) {
      browserWindow.hide();
      return;
    }

    browserWindow.show();
  });

  trayIcon.addListener('right-click', (_event, bounds) => {
    trayIcon.popUpContextMenu(undefined, bounds);
  });

  return trayIcon;
};

const useTrayIcon = (): void => {
  const ref = useRef<Tray>();

  useEffect(() => {
    const trayIcon = createTrayIcon();
    ref.current = trayIcon;

    return () => {
      trayIcon.destroy();
      ref.current = undefined;
    };
  }, []);

  const { t } = useTranslation();

  const globalBadge = useSelector(selectGlobalBadge);

  useEffect(() => {
    const trayIcon = ref.current;
    if (!trayIcon) {
      return;
    }

    updateTrayIconImage(trayIcon, globalBadge);
    updateTrayIconTitle(trayIcon, globalBadge);
    updateTrayIconToolTip(trayIcon, globalBadge, t);
  }, [t, globalBadge]);

  const isRootWindowVisible = useSelector(
    (state: RootState) => state.rootWindowState.visible
  );
  const prevIsRootWindowVisibleRef = useRef(isRootWindowVisible);
  const firstTrayIconBalloonShownRef = useRef(false);

  useEffect(() => {
    const trayIcon = ref.current;
    if (!trayIcon) {
      return;
    }

    const menu = Menu.buildFromTemplate([
      {
        label: isRootWindowVisible ? t('tray.menu.hide') : t('tray.menu.show'),
        click: async () => {
          const browserWindow = await getRootWindow();

          if (isRootWindowVisible) {
            browserWindow.hide();
            return;
          }

          browserWindow.show();
        },
      },
      {
        label: t('tray.menu.quit'),
        click: () => {
          app.quit();
        },
      },
    ]);
    trayIcon.setContextMenu(menu);

    const prevIsRootWindowVisible = prevIsRootWindowVisibleRef.current;
    const firstTrayIconBalloonShown = firstTrayIconBalloonShownRef.current;

    if (
      prevIsRootWindowVisible &&
      !isRootWindowVisible &&
      process.platform === 'win32' &&
      !firstTrayIconBalloonShown
    ) {
      warnStillRunning(trayIcon, t);
      firstTrayIconBalloonShownRef.current = true;
    }
  }, [isRootWindowVisible, t]);
};

const TrayIcon = (): ReactElement | null => {
  useTrayIcon();

  return null;
};

export default TrayIcon;
