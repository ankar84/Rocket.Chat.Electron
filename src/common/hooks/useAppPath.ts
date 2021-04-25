import { useSelector } from 'react-redux';

import { RootState } from '../../store/rootReducer';

export const useAppPath = (): string => {
  const appPath = useSelector((state: RootState) => state.app.path);

  if (appPath === null) {
    throw new Error('app path was not set');
  }

  return appPath;
};
