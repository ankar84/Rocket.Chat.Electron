import type { Tray } from 'electron';
import { RefObject, useEffect } from 'react';

export const useTrayTitle = (
  ref: RefObject<Tray | undefined>,
  globalBadge: number | '•' | undefined
): void => {
  useEffect(() => {
    const trayIcon = ref.current;

    if (!trayIcon || !globalBadge || globalBadge === '•') {
      return;
    }

    trayIcon.setTitle(String(globalBadge));
  }, [globalBadge, ref]);
};
