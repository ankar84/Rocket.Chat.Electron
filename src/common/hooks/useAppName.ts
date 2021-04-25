import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useAppName = (): string => {
  const appName = useSelector((state: RootState) => state.app.name);

  if (appName === null) {
    throw new Error('app name was not set');
  }

  return appName;
};
