import { useAppSelector } from './useAppSelector';

export const useAppName = (): string => {
  const appName = useAppSelector((state) => state.app.name);

  if (appName === null) {
    throw new Error('app name was not set');
  }

  return appName;
};
