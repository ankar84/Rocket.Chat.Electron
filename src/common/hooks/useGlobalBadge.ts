import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useGlobalBadge = (): '•' | number | undefined => {
  const badges = useSelector((state: RootState) =>
    state.servers.map(({ badge }) => badge)
  );

  const mentionCount = useMemo(
    () =>
      badges
        .filter((badge): badge is number => Number.isInteger(badge))
        .reduce<number>((sum, count: number) => sum + count, 0),
    [badges]
  );

  return useMemo(
    () => mentionCount || (badges.some((badge) => !!badge) && '•') || undefined,
    [badges, mentionCount]
  );
};
