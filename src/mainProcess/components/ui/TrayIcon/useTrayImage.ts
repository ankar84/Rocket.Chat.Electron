import type { Tray } from 'electron';
import { RefObject, useEffect } from 'react';

export const useTrayImage = (
  ref: RefObject<Tray | undefined>,
  trayIconImagePath: string
): void => {
  useEffect(() => {
    const trayIcon = ref.current;

    if (!trayIcon) {
      return;
    }

    trayIcon.setImage(trayIconImagePath);
  }, [ref, trayIconImagePath]);
};
