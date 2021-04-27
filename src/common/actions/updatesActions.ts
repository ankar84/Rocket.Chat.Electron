import { createAction } from '@reduxjs/toolkit';

import { UpdateConfiguration } from '../types/UpdateConfiguration';

export const ready = createAction(
  'updates/ready',
  (configuration: UpdateConfiguration) => ({
    payload: configuration,
  })
);

export const checkOnStartupToggled = createAction(
  'updates/checkOnStartupToggled',
  (checkOnStartup: boolean) => ({
    payload: checkOnStartup,
  })
);
