import { useAppSelector } from './useAppSelector';

export const useAppVersion = (): string => {
  const appVersion = useAppSelector((state) => state.app.version);

  if (appVersion === null) {
    throw new Error('app version was not set');
  }

  return appVersion;
};
