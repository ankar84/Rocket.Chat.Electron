import { app } from 'electron';
import { useEffect, useMemo } from 'react';

import { useGlobalBadge } from '../../../common/hooks/useGlobalBadge';
import { usePrevious } from '../../../common/hooks/usePrevious';

const useDockBadge = (globalBadge: number | '•' | undefined) => {
  const globalBadgeText = useMemo(() => {
    if (globalBadge === '•') {
      return '•';
    }

    if (Number.isInteger(globalBadge)) {
      return String(globalBadge);
    }

    return '';
  }, [globalBadge]);

  useEffect(() => {
    app.dock.setBadge(globalBadgeText);
  }, [globalBadgeText]);
};

const useDockBounce = (globalBadge: number | '•' | undefined) => {
  const globalBadgeCount = useMemo(() => {
    if (globalBadge === undefined || globalBadge === '•') {
      return 0;
    }

    return globalBadge;
  }, [globalBadge]);
  const prevGlobalBadgeCount = usePrevious(globalBadgeCount);

  useEffect(() => {
    if (globalBadgeCount <= 0 || (prevGlobalBadgeCount ?? 0) > 0) {
      return;
    }

    app.dock.bounce();
  }, [globalBadgeCount, prevGlobalBadgeCount]);
};

const Dock = (): null => {
  const globalBadge = useGlobalBadge();

  useDockBadge(globalBadge);
  useDockBounce(globalBadge);

  return null;
};

export default Dock;
