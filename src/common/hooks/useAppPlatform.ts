import { useAppSelector } from './useAppSelector';

export const useAppPlatform = (): NodeJS.Platform => {
  const appPlatform = useAppSelector((state) => state.app.platform);

  if (appPlatform === null) {
    throw new Error('app platform was not set');
  }

  return appPlatform;
};
