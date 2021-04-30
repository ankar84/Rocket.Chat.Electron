import { call, takeEvery } from 'redux-saga/effects';

import * as updateCheckActions from '../../common/actions/updateCheckActions';
import * as updateDialogActions from '../../common/actions/updateDialogActions';
import { updates } from '../services/updates';

export function* updatesSaga(): Generator {
  yield takeEvery(updateCheckActions.requested.match, function* () {
    yield call(updates.checkForUpdates);
  });

  yield takeEvery(updateDialogActions.skipUpdateClicked.match, function* () {
    yield call(updates.skipUpdate);
  });

  yield takeEvery(updateDialogActions.installButtonClicked.match, function* () {
    yield call(updates.downloadUpdate);
  });
}
