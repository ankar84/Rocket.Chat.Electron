import type { Tray } from 'electron';
import { RefObject, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppName } from '../../../../common/hooks/useAppName';
import { useAppPlatform } from '../../../../common/hooks/useAppPlatform';
import { usePrevious } from '../../../../common/hooks/usePrevious';
import { getAppIconPath } from '../../../../ui/main/icons';

export const useTrayStillRunningWarning = (
  ref: RefObject<Tray | undefined>,
  rootWindowVisible: boolean
): void => {
  const appName = useAppName();
  const appPlatform = useAppPlatform();

  const { t } = useTranslation();

  const prevIsRootWindowVisible = usePrevious(rootWindowVisible);
  const firstTrayIconBalloonShownRef = useRef(false);

  useEffect(() => {
    const trayIcon = ref.current;

    if (!trayIcon) {
      return;
    }

    const firstTrayIconBalloonShown = firstTrayIconBalloonShownRef.current;

    if (
      prevIsRootWindowVisible &&
      !rootWindowVisible &&
      appPlatform === 'win32' &&
      !firstTrayIconBalloonShown
    ) {
      if (appPlatform !== 'win32') {
        return;
      }

      trayIcon.displayBalloon({
        icon: getAppIconPath({ platform: appPlatform }),
        title: t('tray.balloon.stillRunning.title', { appName }),
        content: t('tray.balloon.stillRunning.content', { appName }),
      });

      firstTrayIconBalloonShownRef.current = true;
    }
  }, [
    appName,
    appPlatform,
    rootWindowVisible,
    prevIsRootWindowVisible,
    ref,
    t,
  ]);
};
