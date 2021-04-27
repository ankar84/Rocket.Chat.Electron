import { AppActionTypeToPayloadMap } from '../app/actions';
import { app } from '../common/reducers/appReducer';
import { SystemIdleState } from '../common/types/SystemIdleState';
import { DeepLinksActionTypeToPayloadMap } from '../deepLinks/actions';
import { DownloadsActionTypeToPayloadMap } from '../downloads/actions';
import { NavigationActionTypeToPayloadMap } from '../navigation/actions';
import { NotificationsActionTypeToPayloadMap } from '../notifications/actions';
import { ScreenSharingActionTypeToPayloadMap } from '../screenSharing/actions';
import { ServersActionTypeToPayloadMap } from '../servers/actions';
import { Server } from '../servers/common';
import { SpellCheckingActionTypeToPayloadMap } from '../spellChecking/actions';
import { UiActionTypeToPayloadMap } from '../ui/actions';
import { UpdatesActionTypeToPayloadMap } from '../updates/actions';

type ActionTypeToPayloadMap = AppActionTypeToPayloadMap &
  DeepLinksActionTypeToPayloadMap &
  DownloadsActionTypeToPayloadMap &
  NavigationActionTypeToPayloadMap &
  NotificationsActionTypeToPayloadMap &
  ScreenSharingActionTypeToPayloadMap &
  ServersActionTypeToPayloadMap &
  SpellCheckingActionTypeToPayloadMap &
  UiActionTypeToPayloadMap &
  UpdatesActionTypeToPayloadMap & {
    'server/idleStateChanged': {
      url: Server['url'];
      idleState: SystemIdleState;
    };
  };

type RootActions = {
  [Type in keyof ActionTypeToPayloadMap]: void extends ActionTypeToPayloadMap[Type]
    ? {
        type: Type;
      }
    : {
        type: Type;
        payload: ActionTypeToPayloadMap[Type];
      };
};

export type ActionOf<Type extends keyof RootActions> = RootActions[Type];

export type RootAction =
  | RootActions[keyof RootActions]
  | Parameters<typeof app>[1];
