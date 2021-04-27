import type { AnyAction } from 'redux';

import { isAnyAction } from './isAnyAction';

export const hasMeta = <A extends AnyAction>(
  action: A
): action is A & { meta: Record<string, unknown> } =>
  isAnyAction(action) &&
  'meta' in action &&
  typeof (action as A & { meta: unknown }).meta === 'object';
