import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useAppVersion = (): string => {
  const appVersion = useSelector((state: RootState) => state.app.version);

  if (appVersion === null) {
    throw new Error('app version was not set');
  }

  return appVersion;
};
