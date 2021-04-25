import { app, BrowserWindow, Menu, Tray } from 'electron';
import { TFunction } from 'i18next';
import { ReactElement, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { usePrevious } from '../../../common/hooks/usePrevious';
import { Server } from '../../../servers/common';
import { select } from '../../../store';
import { RootState } from '../../../store/rootReducer';
import { getAppIconPath, getTrayIconPath } from '../../../ui/main/icons';
import { selectGlobalBadge } from '../../../ui/selectors';
import { useRootWindow } from './RootWindow';

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

const createTrayIcon = (rootWindow: BrowserWindow): Tray => {
  const image = getTrayIconPath({
    platform: process.platform,
    badge: undefined,
  });

  const trayIcon = new Tray(image);

  if (process.platform !== 'darwin') {
    trayIcon.addListener('click', async () => {
      const isRootWindowVisible = select(selectIsRootWindowVisible);

      if (isRootWindowVisible) {
        rootWindow.hide();
        return;
      }

      rootWindow.show();
    });
  }

  trayIcon.addListener('balloon-click', async () => {
    const isRootWindowVisible = select(selectIsRootWindowVisible);
    if (isRootWindowVisible) {
      rootWindow.hide();
      return;
    }

    rootWindow.show();
  });

  trayIcon.addListener('right-click', (_event, bounds) => {
    trayIcon.popUpContextMenu(undefined, bounds);
  });

  return trayIcon;
};

const useTrayIconState = (): void => {
  const ref = useRef<Tray>();

  const rootWindow = useRootWindow();

  useEffect(() => {
    const trayIcon = createTrayIcon(rootWindow);
    ref.current = trayIcon;

    return () => {
      trayIcon.destroy();
      ref.current = undefined;
    };
  }, [rootWindow]);

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
  const prevIsRootWindowVisible = usePrevious(isRootWindowVisible);
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
          if (isRootWindowVisible) {
            rootWindow.hide();
            return;
          }

          rootWindow.show();
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
  }, [isRootWindowVisible, prevIsRootWindowVisible, rootWindow, t]);
};

const TrayIcon = (): ReactElement | null => {
  useTrayIconState();

  return null;
};

export default TrayIcon;
