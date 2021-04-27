import { Store } from 'redux';

import { hasPayload, isErrored, isResponseTo } from '../common/helpers/actions';
import { createMainReduxStore as _createMainReduxStore } from '../mainProcess/createMainReduxStore';
import { createRendererReduxStore as _createRendererReduxStore } from '../rendererProcess/createRendererReduxStore';
import { lastAction } from './catchLastAction';
import { RootAction } from './rootAction';
import { RootState } from './rootReducer';

let reduxStore: Store<RootState, RootAction>;

export const createMainReduxStore = async (): Promise<
  Store<RootState, RootAction>
> => {
  reduxStore = await _createMainReduxStore();
  return reduxStore;
};

export const createRendererReduxStore = async (): Promise<
  Store<RootState, RootAction>
> => {
  reduxStore = await _createRendererReduxStore();
  return reduxStore;
};

export const dispatch = <Action extends RootAction>(action: Action): void => {
  reduxStore.dispatch(action);
};

type Selector<T> = (state: RootState) => T;

export const select = <T>(selector: Selector<T>): T =>
  selector(reduxStore.getState());

export const watch = <T>(
  selector: Selector<T>,
  watcher: (curr: T, prev: T | undefined) => void
): (() => void) => {
  const initial = select(selector);
  watcher(initial, undefined);

  let prev = initial;

  return reduxStore.subscribe(() => {
    const curr: T = select(selector);

    if (Object.is(prev, curr)) {
      return;
    }

    watcher(curr, prev);

    prev = curr;
  });
};

export const listen: {
  <ActionType extends RootAction['type']>(
    type: ActionType,
    listener: (action: Extract<RootAction, { type: ActionType }>) => void
  ): () => void;
  <Action extends RootAction>(
    predicate: (action: RootAction) => action is Action,
    listener: (action: Action) => void
  ): () => void;
} = <ActionType extends RootAction['type'], Action extends RootAction>(
  typeOrPredicate: ActionType | ((action: RootAction) => action is Action),
  listener: (action: RootAction) => void
): (() => void) => {
  const effectivePredicate =
    typeof typeOrPredicate === 'function'
      ? typeOrPredicate
      : (action: RootAction): action is Action =>
          action === undefined
            ? (console.trace(), false)
            : action.type === typeOrPredicate;

  return reduxStore.subscribe(() => {
    if (!effectivePredicate(lastAction)) {
      return;
    }

    listener(lastAction);
  });
};

export const request = <
  Request extends RootAction,
  ResponseTypes extends [...RootAction['type'][]],
  Response extends {
    [Index in keyof ResponseTypes]: Extract<
      RootAction,
      { type: ResponseTypes[Index]; payload: unknown }
    >;
  }[number]
>(
  requestAction: Request,
  ...types: ResponseTypes
): Promise<Response['payload']> =>
  new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);

    const unsubscribe = listen(
      isResponseTo<RootAction, ResponseTypes>(id, ...types),
      (action) => {
        unsubscribe();

        if (isErrored(action)) {
          reject(action.payload);
          return;
        }

        if (hasPayload<RootAction>(action)) {
          resolve(action.payload);
        }
      }
    );

    dispatch({
      ...requestAction,
      meta: {
        request: true,
        id,
      },
    });
  });
