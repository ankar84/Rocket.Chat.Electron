import { app } from 'electron';
import React, { ReactElement, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';
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

  return active;
};

const App = (): ReactElement | null => {
  const active = useIsAppActive();

  const isTrayIconEnabled = useSelector(
    (state: RootState) => state.isTrayIconEnabled
  );

  if (!active) {
    return null;
  }

  return <>{isTrayIconEnabled && <TrayIcon />}</>;
};

export default App;
