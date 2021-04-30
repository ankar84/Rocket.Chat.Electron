import { PayloadActionCreator } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

import * as appActions from '../common/actions/appActions';
import { DeepLinksActionTypeToPayloadMap } from '../common/actions/deepLinksActions';
import { DownloadsActionTypeToPayloadMap } from '../common/actions/downloadsActions';
import { NavigationActionTypeToPayloadMap } from '../common/actions/navigationActions';
import { NotificationsActionTypeToPayloadMap } from '../common/actions/notificationActions';
import { ScreenSharingActionTypeToPayloadMap } from '../common/actions/screenSharingActions';
import { ServersActionTypeToPayloadMap } from '../common/actions/serversActions';
import { SpellCheckingActionTypeToPayloadMap } from '../common/actions/spellCheckingActions';
import { UiActionTypeToPayloadMap } from '../common/actions/uiActions';
import * as updateActions from '../common/actions/updateActions';
import * as updateCheckActions from '../common/actions/updateCheckActions';
import * as updateDialogActions from '../common/actions/updateDialogActions';
import * as updatesActions from '../common/actions/updatesActions';
import { SystemIdleState } from '../common/types/SystemIdleState';
import { Server } from '../servers/common';

type ActionsFrom<Module extends Record<string, unknown>> = {
  [ActionCreatorName in keyof Module as Module[ActionCreatorName] extends AnyAction
    ? Module[ActionCreatorName]['type']
    : never]: Module[ActionCreatorName] extends PayloadActionCreator<infer P>
    ? P
    : void;
};

type ActionTypeToPayloadMap = DeepLinksActionTypeToPayloadMap &
  DownloadsActionTypeToPayloadMap &
  NavigationActionTypeToPayloadMap &
  NotificationsActionTypeToPayloadMap &
  ScreenSharingActionTypeToPayloadMap &
  ServersActionTypeToPayloadMap &
  SpellCheckingActionTypeToPayloadMap &
  UiActionTypeToPayloadMap & {
    'server/idleStateChanged': {
      url: Server['url'];
      idleState: SystemIdleState;
    };
  } & ActionsFrom<typeof appActions> &
  ActionsFrom<typeof updatesActions> &
  ActionsFrom<typeof updateCheckActions> &
  ActionsFrom<typeof updateDialogActions> &
  ActionsFrom<typeof updateActions>;

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

export type RootAction = RootActions[keyof RootActions];
