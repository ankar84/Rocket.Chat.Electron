import { app, Menu, MenuItemConstructorOptions, shell } from 'electron';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { relaunchApp } from '../../../app/main/app';
import { useAppName } from '../../../common/hooks/useAppName';
import { useAppPlatform } from '../../../common/hooks/useAppPlatform';
import { CERTIFICATES_CLEARED } from '../../../navigation/actions';
import { RootAction } from '../../../store/actions';
import { RootState } from '../../../store/rootReducer';
import {
  MENU_BAR_ABOUT_CLICKED,
  MENU_BAR_ADD_NEW_SERVER_CLICKED,
  MENU_BAR_SELECT_SERVER_CLICKED,
  MENU_BAR_TOGGLE_IS_MENU_BAR_ENABLED_CLICKED,
  MENU_BAR_TOGGLE_IS_SHOW_WINDOW_ON_UNREAD_CHANGED_ENABLED_CLICKED,
  MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED,
  MENU_BAR_TOGGLE_IS_TRAY_ICON_ENABLED_CLICKED,
  SIDE_BAR_DOWNLOADS_BUTTON_CLICKED,
} from '../../../ui/actions';
import { askForAppDataReset } from '../../../ui/main/dialogs';
import { getWebContentsByServerUrl } from '../../../ui/main/serverView';
import { useRootWindow } from './RootWindow';

const on = (
  condition: boolean,
  getMenuItems: () => MenuItemConstructorOptions[]
): MenuItemConstructorOptions[] => (condition ? getMenuItems() : []);

const useMenuBarState = (): void => {
  const { t } = useTranslation();
  const appName = useAppName();
  const appPlatform = useAppPlatform();
  const rootWindow = useRootWindow();
  const dispatch = useDispatch<Dispatch<RootAction>>();

  const appMenuTemplate = useMemo(
    (): MenuItemConstructorOptions => ({
      id: 'appMenu',
      label: appPlatform === 'darwin' ? appName : t('menus.fileMenu'),
      submenu: [
        ...on(appPlatform === 'darwin', () => [
          {
            id: 'about',
            label: t('menus.about', { appName }),
            click: async () => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              dispatch({ type: MENU_BAR_ABOUT_CLICKED });
            },
          },
          { type: 'separator' },
          {
            id: 'services',
            label: t('menus.services'),
            role: 'services',
          },
          { type: 'separator' },
          {
            id: 'hide',
            label: t('menus.hide', { appName }),
            role: 'hide',
          },
          {
            id: 'hideOthers',
            label: t('menus.hideOthers'),
            role: 'hideOthers',
          },
          {
            id: 'unhide',
            label: t('menus.unhide'),
            role: 'unhide',
          },
          { type: 'separator' },
        ]),
        ...on(appPlatform !== 'darwin', () => [
          {
            id: 'addNewServer',
            label: t('menus.addNewServer'),
            accelerator: 'CommandOrControl+N',
            click: async () => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              dispatch({ type: MENU_BAR_ADD_NEW_SERVER_CLICKED });
            },
          },
          { type: 'separator' },
        ]),
        {
          id: 'disableGpu',
          label: t('menus.disableGpu'),
          enabled: !app.commandLine.hasSwitch('disable-gpu'),
          click: () => {
            relaunchApp('--disable-gpu');
          },
        },
        { type: 'separator' },
        {
          id: 'quit',
          label: t('menus.quit', { appName }),
          accelerator: 'CommandOrControl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    }),
    [appName, appPlatform, dispatch, rootWindow, t]
  );

  const editMenuTemplate = useMemo(
    (): MenuItemConstructorOptions => ({
      id: 'editMenu',
      label: t('menus.editMenu'),
      submenu: [
        {
          id: 'undo',
          label: t('menus.undo'),
          role: 'undo',
        },
        {
          id: 'redo',
          label: t('menus.redo'),
          role: 'redo',
        },
        { type: 'separator' },
        {
          id: 'cut',
          label: t('menus.cut'),
          role: 'cut',
        },
        {
          id: 'copy',
          label: t('menus.copy'),
          role: 'copy',
        },
        {
          id: 'paste',
          label: t('menus.paste'),
          role: 'paste',
        },
        {
          id: 'selectAll',
          label: t('menus.selectAll'),
          role: 'selectAll',
        },
      ],
    }),
    [t]
  );

  const currentView = useSelector((state: RootState) => state.currentView);
  const isSideBarEnabled = useSelector(
    (state: RootState) => state.isSideBarEnabled
  );
  const isTrayIconEnabled = useSelector(
    (state: RootState) => state.isTrayIconEnabled
  );
  const isMenuBarEnabled = useSelector(
    (state: RootState) => state.isMenuBarEnabled
  );
  const rootWindowState = useSelector(
    (state: RootState) => state.rootWindowState
  );

  const viewMenuTemplate = useMemo(
    (): MenuItemConstructorOptions => ({
      id: 'viewMenu',
      label: t('menus.viewMenu'),
      submenu: [
        {
          id: 'reload',
          label: t('menus.reload'),
          accelerator: 'CommandOrControl+R',
          enabled: typeof currentView === 'object' && !!currentView.url,
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            const guestWebContents =
              typeof currentView === 'object'
                ? getWebContentsByServerUrl(currentView.url)
                : null;
            guestWebContents?.reload();
          },
        },
        {
          id: 'reloadIgnoringCache',
          label: t('menus.reloadIgnoringCache'),
          enabled: typeof currentView === 'object' && !!currentView.url,
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            const guestWebContents =
              typeof currentView === 'object'
                ? getWebContentsByServerUrl(currentView.url)
                : null;
            guestWebContents?.reloadIgnoringCache();
          },
        },
        {
          id: 'openDevTools',
          label: t('menus.openDevTools'),
          enabled: typeof currentView === 'object' && !!currentView.url,
          accelerator:
            appPlatform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
          click: () => {
            const guestWebContents =
              typeof currentView === 'object'
                ? getWebContentsByServerUrl(currentView.url)
                : null;
            guestWebContents?.toggleDevTools();
          },
        },
        { type: 'separator' },
        {
          id: 'back',
          label: t('menus.back'),
          enabled: typeof currentView === 'object' && !!currentView.url,
          accelerator: appPlatform === 'darwin' ? 'Command+[' : 'Alt+Left',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            const guestWebContents =
              typeof currentView === 'object'
                ? getWebContentsByServerUrl(currentView.url)
                : null;
            guestWebContents?.goBack();
          },
        },
        {
          id: 'forward',
          label: t('menus.forward'),
          enabled: typeof currentView === 'object' && !!currentView.url,
          accelerator: appPlatform === 'darwin' ? 'Command+]' : 'Alt+Right',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            const guestWebContents =
              typeof currentView === 'object'
                ? getWebContentsByServerUrl(currentView.url)
                : null;
            guestWebContents?.goForward();
          },
        },
        { type: 'separator' },
        {
          id: 'showTrayIcon',
          label: t('menus.showTrayIcon'),
          type: 'checkbox',
          checked: isTrayIconEnabled,
          click: ({ checked }) => {
            dispatch({
              type: MENU_BAR_TOGGLE_IS_TRAY_ICON_ENABLED_CLICKED,
              payload: checked,
            });
          },
        },
        ...on(appPlatform === 'darwin', () => [
          {
            id: 'showFullScreen',
            label: t('menus.showFullScreen'),
            type: 'checkbox',
            checked: rootWindowState.fullscreen,
            accelerator: 'Control+Command+F',
            click: async ({ checked: enabled }) => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              rootWindow.setFullScreen(enabled);
            },
          },
        ]),
        ...on(appPlatform !== 'darwin', () => [
          {
            id: 'showMenuBar',
            label: t('menus.showMenuBar'),
            type: 'checkbox',
            checked: isMenuBarEnabled,
            click: async ({ checked }) => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              dispatch({
                type: MENU_BAR_TOGGLE_IS_MENU_BAR_ENABLED_CLICKED,
                payload: checked,
              });
            },
          },
        ]),
        {
          id: 'showServerList',
          label: t('menus.showServerList'),
          type: 'checkbox',
          checked: isSideBarEnabled,
          click: async ({ checked }) => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            dispatch({
              type: MENU_BAR_TOGGLE_IS_SIDE_BAR_ENABLED_CLICKED,
              payload: checked,
            });
          },
        },
        { type: 'separator' },
        {
          id: 'resetZoom',
          label: t('menus.resetZoom'),
          accelerator: 'CommandOrControl+0',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            rootWindow.webContents.zoomLevel = 0;
          },
        },
        {
          id: 'zoomIn',
          label: t('menus.zoomIn'),
          accelerator: 'CommandOrControl+Plus',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            if (rootWindow.webContents.zoomLevel >= 9) {
              return;
            }
            rootWindow.webContents.zoomLevel++;
          },
        },
        {
          id: 'zoomOut',
          label: t('menus.zoomOut'),
          accelerator: 'CommandOrControl+-',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            if (rootWindow.webContents.zoomLevel <= -9) {
              return;
            }
            rootWindow.webContents.zoomLevel--;
          },
        },
      ],
    }),
    [
      appPlatform,
      currentView,
      dispatch,
      isMenuBarEnabled,
      isSideBarEnabled,
      isTrayIconEnabled,
      rootWindow,
      rootWindowState.fullscreen,
      t,
    ]
  );

  const servers = useSelector((state: RootState) => state.servers);

  const isShowWindowOnUnreadChangedEnabled = useSelector(
    (state: RootState) => state.isShowWindowOnUnreadChangedEnabled
  );

  const windowMenuTemplate = useMemo(
    (): MenuItemConstructorOptions => ({
      id: 'windowMenu',
      label: t('menus.windowMenu'),
      role: 'windowMenu',
      submenu: [
        ...on(appPlatform === 'darwin', () => [
          {
            id: 'addNewServer',
            label: t('menus.addNewServer'),
            accelerator: 'CommandOrControl+N',
            click: async () => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              dispatch({ type: MENU_BAR_ADD_NEW_SERVER_CLICKED });
            },
          },
          { type: 'separator' },
        ]),
        ...on(servers.length > 0, () => [
          ...servers.map(
            (server, i): MenuItemConstructorOptions => ({
              id: server.url,
              type:
                typeof currentView === 'object' &&
                currentView.url === server.url
                  ? 'checkbox'
                  : 'normal',
              label: server.title?.replace(/&/g, '&&'),
              checked:
                typeof currentView === 'object' &&
                currentView.url === server.url,
              accelerator: `CommandOrControl+${i + 1}`,
              click: async () => {
                if (!rootWindow.isVisible()) {
                  rootWindow.showInactive();
                }
                rootWindow.focus();
                dispatch({
                  type: MENU_BAR_SELECT_SERVER_CLICKED,
                  payload: server.url,
                });
              },
            })
          ),
          { type: 'separator' },
        ]),
        {
          id: 'downloads',
          label: t('menus.downloads'),
          checked: currentView === 'downloads',
          accelerator: 'CommandOrControl+D',
          click: () => {
            dispatch({ type: SIDE_BAR_DOWNLOADS_BUTTON_CLICKED });
          },
        },
        {
          id: 'showOnUnreadMessage',
          type: 'checkbox',
          label: t('menus.showOnUnreadMessage'),
          checked: isShowWindowOnUnreadChangedEnabled,
          click: async ({ checked }) => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            dispatch({
              type: MENU_BAR_TOGGLE_IS_SHOW_WINDOW_ON_UNREAD_CHANGED_ENABLED_CLICKED,
              payload: checked,
            });
          },
        },
        { type: 'separator' },
        {
          id: 'minimize',
          role: 'minimize',
          label: t('menus.minimize'),
          accelerator: 'CommandOrControl+M',
        },
        {
          id: 'close',
          role: 'close',
          label: t('menus.close'),
          accelerator: 'CommandOrControl+W',
        },
      ],
    }),
    [
      appPlatform,
      currentView,
      dispatch,
      isShowWindowOnUnreadChangedEnabled,
      rootWindow,
      servers,
      t,
    ]
  );

  const helpMenuTemplate = useMemo(
    (): MenuItemConstructorOptions => ({
      id: 'helpMenu',
      label: t('menus.helpMenu'),
      role: 'help',
      submenu: [
        {
          id: 'documentation',
          label: t('menus.documentation'),
          click: () => {
            shell.openExternal('https://docs.rocket.chat/');
          },
        },
        {
          id: 'reportIssue',
          label: t('menus.reportIssue'),
          click: () => {
            shell.openExternal(
              'https://github.com/RocketChat/Rocket.Chat/issues/new'
            );
          },
        },
        { type: 'separator' },
        {
          id: 'reload-window',
          label: t('menus.reload'),
          accelerator: 'CommandOrControl+Shift+R',
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            rootWindow.webContents.reload();
          },
        },
        {
          id: 'toggleDevTools',
          label: t('menus.toggleDevTools'),
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            rootWindow.webContents.toggleDevTools();
          },
        },
        { type: 'separator' },
        {
          id: 'clearTrustedCertificates',
          label: t('menus.clearTrustedCertificates'),
          click: async () => {
            if (!rootWindow.isVisible()) {
              rootWindow.showInactive();
            }
            rootWindow.focus();
            dispatch({ type: CERTIFICATES_CLEARED });
          },
        },
        {
          id: 'resetAppData',
          label: t('menus.resetAppData'),
          click: async () => {
            const permitted = await askForAppDataReset();

            if (permitted) {
              relaunchApp('--reset-app-data');
            }
          },
        },
        { type: 'separator' },
        {
          id: 'learnMore',
          label: t('menus.learnMore'),
          click: () => {
            shell.openExternal('https://rocket.chat');
          },
        },
        ...on(appPlatform !== 'darwin', () => [
          {
            id: 'about',
            label: t('menus.about', { appName: app.name }),
            click: async () => {
              if (!rootWindow.isVisible()) {
                rootWindow.showInactive();
              }
              rootWindow.focus();
              dispatch({ type: MENU_BAR_ABOUT_CLICKED });
            },
          },
        ]),
      ],
    }),
    [appPlatform, dispatch, rootWindow, t]
  );

  const menuBarTemplate = useMemo(
    () => [
      appMenuTemplate,
      editMenuTemplate,
      viewMenuTemplate,
      windowMenuTemplate,
      helpMenuTemplate,
    ],
    [
      appMenuTemplate,
      editMenuTemplate,
      helpMenuTemplate,
      viewMenuTemplate,
      windowMenuTemplate,
    ]
  );

  const menu = useMemo(() => Menu.buildFromTemplate(menuBarTemplate), [
    menuBarTemplate,
  ]);

  useEffect(() => {
    if (appPlatform === 'darwin') {
      Menu.setApplicationMenu(menu);
      return;
    }

    Menu.setApplicationMenu(null);
    rootWindow.setMenu(menu);
  }, [menu, appPlatform, rootWindow]);
};

const MenuBar = (): null => {
  useMenuBarState();

  return null;
};

export default MenuBar;
