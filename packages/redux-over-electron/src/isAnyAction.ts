import type { AnyAction } from 'redux';

export const isAnyAction = (action: unknown): action is AnyAction =>
  typeof action === 'object' &&
  action !== null &&
  !Array.isArray(action) &&
  'type' in action &&
  typeof (action as { type: string }).type === 'string';
