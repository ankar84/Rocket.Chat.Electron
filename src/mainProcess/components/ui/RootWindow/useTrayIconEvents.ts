import { app, BrowserWindow } from 'electron';
import { useEffect } from 'react';

import { listen } from '../../../../store';

export const useTrayIconEvents = (rootWindow: BrowserWindow | null): void => {
  useEffect(
    () =>
      listen('trayIcon/clicked', () => {
        if (!rootWindow?.isVisible() || !rootWindow?.isFocused()) {
          rootWindow?.show();
          return;
        }

        rootWindow?.hide();
      }),
    [rootWindow]
  );

  useEffect(
    () =>
      listen('trayIcon/balloonClicked', () => {
        if (!rootWindow?.isVisible() || !rootWindow?.isFocused()) {
          rootWindow?.show();
          return;
        }

        rootWindow?.hide();
      }),
    [rootWindow]
  );

  useEffect(
    () =>
      listen('trayIcon/rootWindowActiveClicked', () => {
        if (!rootWindow?.isVisible() || !rootWindow?.isFocused()) {
          rootWindow?.show();
          return;
        }

        rootWindow?.hide();
      }),
    [rootWindow]
  );

  useEffect(
    () =>
      listen('trayIcon/quitClicked', () => {
        app.quit();
      }),
    [rootWindow]
  );
};
