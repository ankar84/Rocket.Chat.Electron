import { getServerUrl } from '../servers/preload/urls';
import { dispatch, watch } from '../store';

let isAutoAwayEnabled: boolean;
let idleThreshold: number | null;
let goOnline = (): void => undefined;
let goAway = (): void => undefined;

export const listenToUserPresenceChanges = (): void => {
  watch(
    (state) => {
      const server = state.servers.find(
        (server) => server.url === getServerUrl()
      );

      if (!server) {
        return undefined;
      }

      return (
        !server.isAutoAwayEnabled ||
        server.idleState === 'active' ||
        server.idleState === 'unknown'
      );
    },
    (isOnline) => {
      if (isOnline === undefined) {
        return;
      }

      if (isOnline) {
        goOnline();
      } else {
        goAway();
      }
    }
  );
};

export const setUserPresenceDetection = (options: {
  isAutoAwayEnabled: boolean;
  idleThreshold: number | null;
  setUserOnline: (online: boolean) => void;
}): void => {
  isAutoAwayEnabled = options.isAutoAwayEnabled;
  idleThreshold = options.idleThreshold;
  goOnline = () => options.setUserOnline(true);
  goAway = () => options.setUserOnline(false);
  dispatch({
    type: 'webview/userPresenceParametersChanged',
    payload: {
      url: getServerUrl(),
      isAutoAwayEnabled,
      idleThreshold,
    },
  });
};
