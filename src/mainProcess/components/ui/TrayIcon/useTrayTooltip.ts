import type { Tray } from 'electron';
import { RefObject, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppName } from '../../../../common/hooks/useAppName';

export const useTrayTooltip = (
  ref: RefObject<Tray | undefined>,
  globalBadge: number | '•' | undefined
): void => {
  const appName = useAppName();
  const { t } = useTranslation();

  useEffect(() => {
    const trayIcon = ref.current;

    if (!trayIcon) {
      return;
    }

    if (globalBadge === '•') {
      trayIcon.setToolTip(t('tray.tooltip.unreadMessage', { appName }));
      return;
    }

    if (typeof globalBadge === 'number') {
      trayIcon.setToolTip(
        t('tray.tooltip.unreadMention', {
          appName,
          count: globalBadge,
        })
      );
      return;
    }

    trayIcon.setToolTip(t('tray.tooltip.noUnreadMessage', { appName }));
  }, [t, globalBadge, appName, ref]);
};
