import { Menu, Tray } from 'electron';
import { RefObject, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../../common/hooks/useAppDispatch';

export const useTrayMenu = (
  ref: RefObject<Tray | undefined>,
  rootWindowActive: boolean
): void => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const handleRootWindowActiveClick = useCallback(() => {
    dispatch({
      type: 'trayIcon/rootWindowActiveClicked',
    });
  }, [dispatch]);

  const handleQuitClick = useCallback(() => {
    dispatch({
      type: 'trayIcon/quitClicked',
    });
  }, [dispatch]);

  const menuTemplate = useMemo(
    () => [
      {
        label: rootWindowActive ? t('tray.menu.hide') : t('tray.menu.show'),
        click: handleRootWindowActiveClick,
      },
      {
        label: t('tray.menu.quit'),
        click: handleQuitClick,
      },
    ],
    [handleQuitClick, handleRootWindowActiveClick, rootWindowActive, t]
  );

  useEffect(() => {
    const trayIcon = ref.current;

    if (!trayIcon) {
      return;
    }

    const menu = Menu.buildFromTemplate(menuTemplate);
    trayIcon.setContextMenu(menu);
  }, [menuTemplate, ref]);
};
