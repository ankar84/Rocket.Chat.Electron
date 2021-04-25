import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { nativeImage, TouchBar as _TouchBar } from 'electron';
import type {
  TouchBarScrubber,
  TouchBarPopover,
  TouchBarSegmentedControl,
} from 'electron';
import { TFunction } from 'i18next';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../../common/hooks/useAppDispatch';
import { useAppPath } from '../../../common/hooks/useAppPath';
import { useAppSelector } from '../../../common/hooks/useAppSelector';
import { Server } from '../../../servers/common';
import {
  TOUCH_BAR_FORMAT_BUTTON_TOUCHED,
  TOUCH_BAR_SELECT_SERVER_TOUCHED,
} from '../../../ui/actions';
import { useRootWindow } from './RootWindow';

const useServerSelectionScrubber = () => {
  const ref = useRef<TouchBarScrubber>();

  const rootWindow = useRootWindow();
  const dispatch = useAppDispatch();
  const servers = useAppSelector((state) => state.servers);

  const handleSelect = useMutableCallback((index: number) => {
    if (!rootWindow.isVisible()) {
      rootWindow.showInactive();
    }
    rootWindow.focus();

    const { url } = servers[index];
    dispatch({ type: TOUCH_BAR_SELECT_SERVER_TOUCHED, payload: url });
  });

  if (!ref.current) {
    ref.current = new _TouchBar.TouchBarScrubber({
      selectedStyle: 'background',
      mode: 'free',
      continuous: false,
      items: [],
      select: handleSelect,
    });
  }

  return ref.current;
};

const useServerSelectionPopover = (
  serverSelectionScrubber: TouchBarScrubber
) => {
  const ref = useRef<TouchBarPopover>();
  const { t } = useTranslation();

  if (!ref.current) {
    ref.current = new _TouchBar.TouchBarPopover({
      label: t('touchBar.selectServer'),
      icon: undefined,
      items: new _TouchBar({ items: [serverSelectionScrubber] }),
      showCloseButton: true,
    });
  }

  return ref.current;
};

const ids = ['bold', 'italic', 'strike', 'inline_code', 'multi_line'] as const;

const useMessageBoxFormattingButtons = () => {
  const ref = useRef<TouchBarSegmentedControl>();

  const appPath = useAppPath();
  const rootWindow = useRootWindow();
  const dispatch = useAppDispatch();

  const handleChange = useMutableCallback(async (selectedIndex) => {
    if (!rootWindow.isVisible()) {
      rootWindow.showInactive();
    }
    rootWindow.focus();

    dispatch({
      type: TOUCH_BAR_FORMAT_BUTTON_TOUCHED,
      payload: ids[selectedIndex],
    });
  });

  if (!ref.current) {
    ref.current = new _TouchBar.TouchBarSegmentedControl({
      mode: 'buttons',
      segments: ids.map((id) => ({
        icon: nativeImage.createFromPath(
          `${appPath}/app/images/touch-bar/${id}.png`
        ),
        enabled: false,
      })),
      change: handleChange,
    });
  }

  return ref.current;
};

const toggleMessageFormattingButtons = (
  messageBoxFormattingButtons: TouchBarSegmentedControl,
  isEnabled: boolean
): void => {
  messageBoxFormattingButtons.segments.forEach((segment) => {
    segment.enabled = isEnabled;
  });
};

const updateServerSelectionScrubber = (
  serverSelectionScrubber: TouchBarScrubber,
  servers: Server[]
): void => {
  serverSelectionScrubber.items = servers.map((server) => ({
    label: server.title?.padEnd(30),
    icon: server.favicon
      ? nativeImage.createFromDataURL(server.favicon)
      : undefined,
  }));
};

const updateServerSelectionPopover = (
  serverSelectionPopover: TouchBarPopover,
  currentServer: Server | null,
  t: TFunction
): void => {
  serverSelectionPopover.label =
    currentServer?.title ?? t('touchBar.selectServer');
  serverSelectionPopover.icon = currentServer?.favicon
    ? nativeImage.createFromDataURL(currentServer?.favicon)
    : nativeImage.createEmpty();
};

const createTouchBar = (
  serverSelectionScrubber: TouchBarScrubber,
  serverSelectionPopover: TouchBarPopover,
  messageBoxFormattingButtons: TouchBarSegmentedControl
): [_TouchBar, TouchBarPopover, TouchBarScrubber, TouchBarSegmentedControl] => {
  const touchBar = new _TouchBar({
    items: [
      serverSelectionPopover,
      new _TouchBar.TouchBarSpacer({ size: 'flexible' }),
      messageBoxFormattingButtons,
      new _TouchBar.TouchBarSpacer({ size: 'flexible' }),
    ],
  });

  return [
    touchBar,
    serverSelectionPopover,
    serverSelectionScrubber,
    messageBoxFormattingButtons,
  ];
};

const useTouchBarState = (): void => {
  const serverSelectionScrubber = useServerSelectionScrubber();
  const serverSelectionPopover = useServerSelectionPopover(
    serverSelectionScrubber
  );
  const messageBoxFormattingButtons = useMessageBoxFormattingButtons();

  const ref = useRef<
    [_TouchBar, TouchBarPopover, TouchBarScrubber, TouchBarSegmentedControl]
  >();

  const rootWindow = useRootWindow();

  useEffect(() => {
    const [touchBar] = createTouchBar(
      serverSelectionScrubber,
      serverSelectionPopover,
      messageBoxFormattingButtons
    );
    ref.current = [
      touchBar,
      serverSelectionPopover,
      serverSelectionScrubber,
      messageBoxFormattingButtons,
    ];

    rootWindow.setTouchBar(touchBar);

    return () => {
      rootWindow.setTouchBar(null);
    };
  }, [
    rootWindow,
    serverSelectionScrubber,
    serverSelectionPopover,
    messageBoxFormattingButtons,
  ]);

  const currentServer = useAppSelector(
    ({ servers, currentView }): Server | null =>
      typeof currentView === 'object'
        ? servers.find(({ url }) => url === currentView.url) ?? null
        : null
  );

  const { t } = useTranslation();

  useEffect(() => {
    const components = ref.current;

    if (!components) {
      return;
    }

    const [touchBar, serverSelectionPopover] = components;

    updateServerSelectionPopover(serverSelectionPopover, currentServer, t);
    rootWindow.setTouchBar(touchBar);
  }, [currentServer, rootWindow, t]);

  const servers = useAppSelector((state) => state.servers);

  useEffect(() => {
    const components = ref.current;

    if (!components) {
      return;
    }

    const [touchBar, , serverSelectionScrubber] = components;

    updateServerSelectionScrubber(serverSelectionScrubber, servers);
    rootWindow.setTouchBar(touchBar);
  }, [currentServer, rootWindow, servers]);

  const isMessageBoxFocused = useAppSelector(
    (state) => state.isMessageBoxFocused
  );

  useEffect(() => {
    const components = ref.current;

    if (!components) {
      return;
    }

    const [touchBar, , , messageBoxFormattingButtons] = components;

    toggleMessageFormattingButtons(
      messageBoxFormattingButtons,
      isMessageBoxFocused
    );
    rootWindow.setTouchBar(touchBar);
  }, [isMessageBoxFocused, rootWindow]);
};

const TouchBar = (): null => {
  useTouchBarState();

  return null;
};

export default TouchBar;
