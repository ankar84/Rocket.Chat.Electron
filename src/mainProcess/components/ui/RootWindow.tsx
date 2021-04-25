import { app, BrowserWindow } from 'electron';
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getRootWindow } from '../../../ui/main/rootWindow';

const RootWindowContext = createContext(null as BrowserWindow | null);

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

export const useRootWindow = (): BrowserWindow => {
  const rootWindow = useContext(RootWindowContext);

  if (!rootWindow) {
    throw new Error('root window not provided');
  }

  return rootWindow;
};
