import type { AnyAction } from 'redux';

import { hasMeta } from './hasMeta';

export const isLocallyScoped = <A extends AnyAction>(
  action: A
): action is A & { meta: { scope: 'local' } } =>
  hasMeta(action) &&
  (action as A & { meta: { scope: unknown } }).meta.scope === 'local';
