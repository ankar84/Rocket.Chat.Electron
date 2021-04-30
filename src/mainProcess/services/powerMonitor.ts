import { powerMonitor } from 'electron';

import { Server } from '../../servers/common';
import { dispatch, select } from '../../store';

type ServerWithUserPresence = Server & {
  isAutoAwayEnabled: true;
  idleThreshold: number;
};

const hasUserPresence = (server: Server): server is ServerWithUserPresence =>
  server.isAutoAwayEnabled === true && server.idleThreshold !== null;

const forEachServerWithUserPresence = (
  cb: (server: ServerWithUserPresence) => void
): void => {
  const servers = select((state) => state.servers);

  for (const server of servers) {
    if (!hasUserPresence(server)) {
      continue;
    }

    cb(server);
  }
};

const declareAllServersIdle = (): void => {
  forEachServerWithUserPresence((server) => {
    dispatch({
      type: 'server/idleStateChanged',
      payload: {
        url: server.url,
        idleState: 'idle',
      },
    });
  });
};

const declareAllServersActive = (): void => {
  forEachServerWithUserPresence((server) => {
    dispatch({
      type: 'server/idleStateChanged',
      payload: {
        url: server.url,
        idleState: 'active',
      },
    });
  });
};

export const setupPowerMonitor = (): void => {
  powerMonitor.addListener('suspend', () => {
    declareAllServersIdle();
  });

  powerMonitor.addListener('resume', () => {
    declareAllServersActive();
  });

  powerMonitor.addListener('lock-screen', () => {
    declareAllServersIdle();
  });

  powerMonitor.addListener('unlock-screen', () => {
    declareAllServersActive();
  });

  const pollSystemIdleState = (): void => {
    forEachServerWithUserPresence((server) => {
      dispatch({
        type: 'server/idleStateChanged',
        payload: {
          url: server.url,
          idleState: powerMonitor.getSystemIdleState(server.idleThreshold),
        },
      });
    });

    setTimeout(pollSystemIdleState, 1000);
  };

  pollSystemIdleState();
};
