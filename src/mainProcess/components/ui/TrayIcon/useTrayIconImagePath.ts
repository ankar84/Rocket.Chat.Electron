import { useMemo } from 'react';

import { useAppPlatform } from '../../../../common/hooks/useAppPlatform';
import { getTrayIconPath } from '../../../../ui/main/icons';

export const useTrayIconImagePath = (
  badge: number | '•' | undefined
): string => {
  const appPlatform = useAppPlatform();
  return useMemo(
    () =>
      getTrayIconPath({
        platform: appPlatform,
        badge,
      }),
    [appPlatform, badge]
  );
};
