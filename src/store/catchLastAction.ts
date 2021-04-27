import { Dispatch } from 'redux';

import { RootAction } from './rootAction';

export let lastAction: RootAction;

export const catchLastAction = () => (next: Dispatch<RootAction>) => (
  action: RootAction
): RootAction => {
  lastAction = action;
  return next(action);
};
