import { Certificate } from 'electron';
import { Reducer } from 'redux';

import { Server } from '../../servers/common';
import { ActionOf } from '../../store/rootAction';
import * as appActions from '../actions/appActions';
import {
  CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED,
  SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED,
  SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED,
  CERTIFICATES_UPDATED,
  CERTIFICATES_CLEARED,
  CERTIFICATES_LOADED,
  EXTERNAL_PROTOCOL_PERMISSION_UPDATED,
} from '../actions/navigationActions';

type ClientCertificatesActionTypes =
  | ActionOf<typeof CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED>
  | ActionOf<typeof SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED>
  | ActionOf<typeof SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED>;

export const clientCertificates: Reducer<
  Certificate[],
  ClientCertificatesActionTypes
> = (state = [], action) => {
  switch (action.type) {
    case CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED:
      return action.payload;

    case SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED:
    case SELECT_CLIENT_CERTIFICATE_DIALOG_DISMISSED:
      return [];

    default:
      return state;
  }
};

type TrustedCertificatesAction =
  | ActionOf<typeof CERTIFICATES_LOADED>
  | ActionOf<typeof CERTIFICATES_UPDATED>
  | ActionOf<typeof CERTIFICATES_CLEARED>
  | ActionOf<typeof appActions.settingsLoaded.type>;

export const trustedCertificates: Reducer<
  Record<Server['url'], Certificate['fingerprint']>,
  TrustedCertificatesAction
> = (state = {}, action) => {
  switch (action.type) {
    case CERTIFICATES_LOADED:
    case CERTIFICATES_UPDATED:
      return action.payload;

    case CERTIFICATES_CLEARED:
      return {};

    case appActions.settingsLoaded.type: {
      const { trustedCertificates = state } = action.payload;
      return trustedCertificates;
    }

    default:
      return state;
  }
};

type ExternalProtocolsAction =
  | ActionOf<typeof appActions.settingsLoaded.type>
  | ActionOf<typeof EXTERNAL_PROTOCOL_PERMISSION_UPDATED>;

export const externalProtocols: Reducer<
  Record<string, boolean>,
  ExternalProtocolsAction
> = (state = {}, action) => {
  switch (action.type) {
    case appActions.settingsLoaded.type: {
      const { externalProtocols = {} } = action.payload;
      state = externalProtocols;
      return state;
    }

    case EXTERNAL_PROTOCOL_PERMISSION_UPDATED: {
      state = {
        ...state,
        [action.payload.protocol]: action.payload.allowed,
      };
      return state;
    }

    default:
      return state;
  }
};
