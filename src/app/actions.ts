import { PersistableValues } from './PersistableValues';

export const APP_ERROR_THROWN = 'app/error-thrown';
export const APP_SETTINGS_LOADED = 'app/settings-loaded';

export type AppActionTypeToPayloadMap = {
  [APP_ERROR_THROWN]: Error;
  [APP_SETTINGS_LOADED]: Partial<PersistableValues>;
};
