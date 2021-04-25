import { app, BrowserWindow } from 'electron';
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { getRootWindow } from '../../../../ui/main/rootWindow';
import RootWindowContext from './RootWindowContext';
import { useTrayIconEvents } from './useTrayIconEvents';

type RootWindowProps = {
  children?: ReactNode;
};

const RootWindow = ({ children }: RootWindowProps): ReactElement | null => {
  const [rootWindow, setRootWindow] = useState<BrowserWindow | null>(null);

  useEffect(() => {
    getRootWindow().then(setRootWindow);
  }, []);

  const handleActivate = useCallback(() => {
    if (!rootWindow) {
      return;
    }

    if (!rootWindow.isVisible()) {
      rootWindow.showInactive();
    }

    rootWindow.focus();
  }, [rootWindow]);

  useEffect(() => {
    app.addListener('activate', handleActivate);
    return () => {
      app.removeListener('activate', handleActivate);
    };
  }, [handleActivate]);

  useTrayIconEvents(rootWindow);

  if (!rootWindow) {
    return null;
  }

  return (
    <RootWindowContext.Provider value={rootWindow}>
      {children}
    </RootWindowContext.Provider>
  );
};

export default RootWindow;
