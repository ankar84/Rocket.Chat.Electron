import type { BrowserWindow } from 'electron';
import { createContext, useContext } from 'react';

const RootWindowContext = createContext(null as BrowserWindow | null);

export default RootWindowContext;

export const useRootWindow = (): BrowserWindow => {
  const rootWindow = useContext(RootWindowContext);

  if (!rootWindow) {
    throw new Error('root window not provided');
  }

  return rootWindow;
};
