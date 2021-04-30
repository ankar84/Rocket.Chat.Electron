import { all } from 'redux-saga/effects';

import { updatesSaga } from './updatesSaga';

export function* rootSaga(): Generator {
  yield all([updatesSaga()]);
}
