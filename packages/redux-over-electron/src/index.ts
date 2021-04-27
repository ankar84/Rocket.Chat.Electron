import { ipcMain, ipcRenderer, WebContents } from 'electron';
import { MiddlewareAPI, Dispatch, AnyAction } from 'redux';

const actionDispatchedChannel = 'redux/actionDispatched' as const;
const getInitialStateChannel = 'redux/getInitialState' as const;

const isAnyAction = (action: unknown): action is AnyAction =>
  typeof action === 'object' &&
  action !== null &&
  !Array.isArray(action) &&
  'type' in action &&
  typeof (action as { type: string }).type === 'string';

const hasMeta = <A extends AnyAction>(
  action: A
): action is A & { meta: Record<string, unknown> } =>
  isAnyAction(action) &&
  'meta' in action &&
  typeof (action as A & { meta: unknown }).meta === 'object';

const isLocallyScoped = <A extends AnyAction>(
  action: A
): action is A & { meta: { scope: 'local' } } =>
  hasMeta(action) &&
  (action as A & { meta: { scope: unknown } }).meta.scope === 'local';

export const forwardToRenderers = <
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>,
  S = any,
  A extends AnyAction = D extends Dispatch<infer Action> ? Action : never
>(
  api: MiddlewareAPI<D, S>
): ((next: D) => (action: A) => A) => {
  const renderers = new Set<WebContents>();

  ipcMain.handle(
    getInitialStateChannel,
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

  return (next: D) => (action: A) => {
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

export const getInitialState = <S = any>(): Promise<S> =>
  ipcRenderer.invoke(getInitialStateChannel) as Promise<S>;

export const forwardToMain = <
  D extends Dispatch<AnyAction> = Dispatch<AnyAction>,
  S = any,
  A extends AnyAction = D extends Dispatch<infer Action> ? Action : never
>(
  api: MiddlewareAPI<D, S>
): ((next: D) => (action: A) => A) => {
  ipcRenderer.on(actionDispatchedChannel, (_, action: A) => {
    api.dispatch(action);
  });

  return (next: D) => (action: A) => {
    if (!isAnyAction(action) || isLocallyScoped(action)) {
      return next(action);
    }

    ipcRenderer.send(actionDispatchedChannel, action);
    return action;
  };
};
