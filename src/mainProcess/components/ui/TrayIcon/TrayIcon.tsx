import type { ReactElement } from 'react';

import { useAppSelector } from '../../../../common/hooks/useAppSelector';
import { useGlobalBadge } from '../../../../common/hooks/useGlobalBadge';
import { useTrayIconImagePath } from './useTrayIconImagePath';
import { useTrayImage } from './useTrayImage';
import { useTrayInstance } from './useTrayInstance';
import { useTrayMenu } from './useTrayMenu';
import { useTrayStillRunningWarning } from './useTrayStillRunningWarning';
import { useTrayTitle } from './useTrayTitle';
import { useTrayTooltip } from './useTrayTooltip';

const TrayIcon = (): ReactElement | null => {
  const globalBadge = useGlobalBadge();
  const trayIconImagePath = useTrayIconImagePath(globalBadge);
  const rootWindowActive = useAppSelector(
    (state) => state.rootWindowState.visible && state.rootWindowState.focused
  );
  const rootWindowVisible = useAppSelector(
    (state) => state.rootWindowState.visible
  );

  const ref = useTrayInstance(trayIconImagePath);
  useTrayImage(ref, trayIconImagePath);
  useTrayTitle(ref, globalBadge);
  useTrayTooltip(ref, globalBadge);
  useTrayMenu(ref, rootWindowActive);
  useTrayStillRunningWarning(ref, rootWindowVisible);

  return null;
};

export default TrayIcon;
