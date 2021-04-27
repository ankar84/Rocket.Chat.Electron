import { ipcMain, WebContents } from 'electron';
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux';

import { actionDispatchedChannel, getPreloadedStateChannel } from './constants';
import { hasMeta } from './hasMeta';
import { isAnyAction } from './isAnyAction';
import { isLocallyScoped } from './isLocallyScoped';

export const forwardToRenderers = <S = any, D extends Dispatch = Dispatch>(
  api: MiddlewareAPI<D, S>
): ((next: Dispatch<AnyAction>) => (action: any) => any) => {
  const renderers = new Set<WebContents>();

  ipcMain.handle(
    getPreloadedStateChannel,
    (event): S => {
      const renderer = event.sender;
      renderers.add(renderer);

      renderer.addListener('destroyed', () => {
        renderers.delete(renderer);
      });

      return api.getState();
    }
  );

  ipcMain.on(actionDispatchedChannel, (_, action) => {
    api.dispatch(action);
  });

  return (next) => (action) => {
    if (!isAnyAction(action) || isLocallyScoped(action)) {
      return next(action);
    }

    const forwardedAction = {
      ...action,
      meta: {
        ...(hasMeta(action) && action.meta),
        scope: 'local',
      },
    };

    for (const renderer of renderers) {
      renderer.send(actionDispatchedChannel, forwardedAction);
    }

    return next(action);
  };
};
