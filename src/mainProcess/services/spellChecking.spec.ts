import { SPELL_CHECKING_LANGUAGE_TOGGLED } from '../../common/actions/spellCheckingActions';
import { dispatch, setReduxStore } from '../../store';
import { createMainReduxStore } from '../createMainReduxStore';
import { setupSpellChecking } from './spellChecking';

describe('setupSpellChecking', () => {
  beforeAll(async () => {
    setReduxStore(await createMainReduxStore());
  });

  it('works', async () => {
    await setupSpellChecking();
  });

  it('handles invalid languages', async () => {
    await setupSpellChecking();
    dispatch({
      type: SPELL_CHECKING_LANGUAGE_TOGGLED,
      payload: {
        name: 'wtf',
        enabled: true,
      },
    });
  });
});
