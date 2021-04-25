import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { Rectangle, Tray } from 'electron';
import { RefObject, useCallback, useEffect, useRef } from 'react';

import { useAppDispatch } from '../../../../common/hooks/useAppDispatch';
import { useAppPlatform } from '../../../../common/hooks/useAppPlatform';

export const useTrayInstance = (
  trayIconImagePath: string
): RefObject<Tray | undefined> => {
  const ref = useRef<Tray>();

  const appPlatform = useAppPlatform();

  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch({ type: 'trayIcon/clicked' });
  }, [dispatch]);

  const handleBallonClick = useCallback(() => {
    dispatch({ type: 'trayIcon/balloonClicked' });
  }, [dispatch]);

  const handleRightClick = useMutableCallback(
    (_event: Event, bounds: Rectangle) => {
      const trayIcon = ref.current;

      if (!trayIcon) {
        return;
      }

      trayIcon.popUpContextMenu(undefined, bounds);
    }
  );

  const initialTrayIconImagePath = useRef(trayIconImagePath);

  useEffect(() => {
    const trayIcon = new Tray(initialTrayIconImagePath.current);

    if (appPlatform !== 'darwin') {
      trayIcon.addListener('click', handleClick);
    }

    trayIcon.addListener('balloon-click', handleBallonClick);
    trayIcon.addListener('right-click', handleRightClick);

    ref.current = trayIcon;

    return () => {
      trayIcon.destroy();
      ref.current = undefined;
    };
  }, [appPlatform, handleBallonClick, handleClick, handleRightClick]);

  return ref;
};
