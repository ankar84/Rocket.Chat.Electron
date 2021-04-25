import { AppInfo } from '../../types/AppInfo';

type SetInfo = {
  type: 'app/set-info';
  payload: AppInfo;
};

type Action = SetInfo;

type State = {
  [Key in keyof AppInfo]: AppInfo[Key] | null;
};

const initialState: State = {
  name: null,
  locale: null,
  path: null,
  platform: null,
  version: null,
};

export const app = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'app/set-info': {
      return action.payload;
    }

    default:
      return state;
  }
};
