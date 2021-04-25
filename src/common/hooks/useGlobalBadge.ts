import { useMemo } from 'react';

import { useAppSelector } from './useAppSelector';

export const useGlobalBadge = (): '•' | number | undefined => {
  const badges = useAppSelector((state) =>
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
