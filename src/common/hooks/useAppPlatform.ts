import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useAppPlatform = (): NodeJS.Platform => {
  const appPlatform = useSelector((state: RootState) => state.app.platform);

  if (appPlatform === null) {
    throw new Error('app platform was not set');
  }

  return appPlatform;
};
