import { ipcRenderer } from 'electron';
import { DeepPartial } from 'redux';

import { getPreloadedStateChannel } from './constants';

export const getPreloadedState = <S = any>(): Promise<DeepPartial<S>> =>
  ipcRenderer.invoke(getPreloadedStateChannel) as Promise<DeepPartial<S>>;
