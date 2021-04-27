import { ipcRenderer } from 'electron';
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { actionDispatchedChannel } from './constants';
import { isAnyAction } from './isAnyAction';
import { isLocallyScoped } from './isLocallyScoped';

export const forwardToMain = <S = any, D extends Dispatch = Dispatch>(
  api: MiddlewareAPI<D, S>
): ((next: Dispatch<AnyAction>) => (action: any) => any) => {
  ipcRenderer.on(actionDispatchedChannel, (_, action) => {
    api.dispatch(action);
  });

  return (next) => (action) => {
    if (!isAnyAction(action) || isLocallyScoped(action)) {
      return next(action);
    }

    ipcRenderer.send(actionDispatchedChannel, action);
    return next(action);
  };
};
