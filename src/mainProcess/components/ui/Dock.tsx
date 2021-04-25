import { app } from 'electron';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { usePrevious } from '../../../common/hooks/usePrevious';
import {
  selectGlobalBadgeCount,
  selectGlobalBadgeText,
} from '../../../ui/selectors';

const useDockState = (): void => {
  const globalBadgeText = useSelector(selectGlobalBadgeText);
  const globalBadgeCount = useSelector(selectGlobalBadgeCount);
  const prevGlobalBadgeCount = usePrevious(globalBadgeCount);

  useEffect(() => {
    app.dock.setBadge(globalBadgeText);
  }, [globalBadgeText]);

  useEffect(() => {
    if (globalBadgeCount <= 0 || (prevGlobalBadgeCount ?? 0) > 0) {
      return;
    }

    app.dock.bounce();
  }, [globalBadgeCount, prevGlobalBadgeCount]);
};

const Dock = (): null => {
  useDockState();

  return null;
};

export default Dock;
