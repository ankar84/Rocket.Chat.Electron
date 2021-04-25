import { app } from 'electron';
import React, {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import { useAppPlatform } from '../../common/hooks/useAppPlatform';
import { RootState } from '../../store/rootReducer';
import Dock from './ui/Dock';
import MenuBar from './ui/MenuBar';
import RootWindow from './ui/RootWindow';
import TouchBar from './ui/TouchBar';
import TrayIcon from './ui/TrayIcon';

const useIsAppActive = (): boolean => {
  const [active, setActive] = useState(true);

  useLayoutEffect(() => {
    const listener = () => {
      setActive(false);
    };

    app.addListener('before-quit', listener);

    return () => {
      app.removeListener('before-quit', listener);
    };
  }, []);

  useEffect(() => {
    const handleWindowAllClosed = (): void => undefined;
    app.addListener('window-all-closed', handleWindowAllClosed);
    return () => {
      app.removeListener('window-all-closed', handleWindowAllClosed);
    };
  }, []);

  return active;
};

const App = (): ReactElement | null => {
  const active = useIsAppActive();

  const isTrayIconEnabled = useSelector(
    (state: RootState) => state.isTrayIconEnabled
  );

  const platform = useAppPlatform();
  const dockAvailable = platform === 'darwin';
  const touchBarAvailable = platform === 'darwin';

  if (!active) {
    return null;
  }

  return (
    <RootWindow>
      <MenuBar />
      {isTrayIconEnabled && <TrayIcon />}
      {dockAvailable && <Dock />}
      {touchBarAvailable && <TouchBar />}
    </RootWindow>
  );
};

export default App;
