import { useAppSelector } from './useAppSelector';

export const useAppPath = (): string => {
  const appPath = useAppSelector((state) => state.app.path);

  if (appPath === null) {
    throw new Error('app path was not set');
  }

  return appPath;
};
