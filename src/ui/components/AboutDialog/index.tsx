import {
  Box,
  Button,
  Field,
  Margins,
  Throbber,
  ToggleSwitch,
} from '@rocket.chat/fuselage';
import { useUniqueId, useAutoFocus } from '@rocket.chat/fuselage-hooks';
import React, { useState, useEffect, FC, ChangeEvent } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { ABOUT_DIALOG_DISMISSED } from '../../../common/actions/uiActions';
import * as updateCheckActions from '../../../common/actions/updateCheckActions';
import * as updatesActions from '../../../common/actions/updatesActions';
import { useAppDispatch } from '../../../common/hooks/useAppDispatch';
import { useAppSelector } from '../../../common/hooks/useAppSelector';
import { useAppVersion } from '../../../common/hooks/useAppVersion';
import { Dialog } from '../Dialog';
import { RocketChatLogo } from '../RocketChatLogo';

const copyright = `© 2016-${new Date().getFullYear()}, Rocket.Chat`;

export const AboutDialog: FC = () => {
  const appVersion = useAppVersion();
  const doCheckForUpdatesOnStartup = useAppSelector(
    ({ updates }) => updates.settings.checkOnStartup
  );
  const checking = useAppSelector(({ updates }) => updates.updateCheck);
  const isEachUpdatesSettingConfigurable = useAppSelector(
    ({ updates }) => updates.settings.editable
  );
  const isUpdatingAllowed = useAppSelector(({ updates }) => updates.allowed);
  const isUpdatingEnabled = useAppSelector(
    ({ updates }) => updates.settings.enabled
  );
  const openDialog = useAppSelector(({ openDialog }) => openDialog);

  const isVisible = openDialog === 'about';
  const canUpdate = isUpdatingAllowed && isUpdatingEnabled;
  const isCheckForUpdatesOnStartupChecked =
    isUpdatingAllowed && isUpdatingEnabled && doCheckForUpdatesOnStartup;
  const canSetCheckForUpdatesOnStartup =
    isUpdatingAllowed && isEachUpdatesSettingConfigurable;

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const [
    [checkingForUpdates, checkingForUpdatesMessage],
    setCheckingForUpdates,
  ] = useState([false, null]);

  useEffect(() => {
    if (checking?.status === 'rejected') {
      setCheckingForUpdates([
        true,
        t('dialog.about.errorWhenLookingForUpdates'),
      ]);

      const messageTimer = setTimeout(() => {
        setCheckingForUpdates([false, null]);
      }, 5000);

      return () => {
        clearTimeout(messageTimer);
      };
    }

    if (checking?.status === 'pending') {
      setCheckingForUpdates([true, null]);
      return undefined;
    }

    if (checking?.newVersion) {
      setCheckingForUpdates([false, null]);
      return undefined;
    }

    setCheckingForUpdates([true, t('dialog.about.noUpdatesAvailable')]);
    const messageTimer = setTimeout(() => {
      setCheckingForUpdates([false, null]);
    }, 5000);

    return () => {
      clearTimeout(messageTimer);
    };
  }, [checking, t]);

  const handleCheckForUpdatesButtonClick = (): void => {
    dispatch(updateCheckActions.requested());
  };

  const handleCheckForUpdatesOnStartCheckBoxChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(updatesActions.checkOnStartupToggled(event.target.checked));
  };

  const checkForUpdatesButtonRef = useAutoFocus(isVisible);
  const checkForUpdatesOnStartupToggleSwitchId = useUniqueId();

  return (
    <Dialog
      isVisible={isVisible}
      onClose={() => dispatch({ type: ABOUT_DIALOG_DISMISSED })}
    >
      <Margins block='x16'>
        <RocketChatLogo />

        <Box alignSelf='center'>
          <Trans t={t} i18nKey='dialog.about.version'>
            Version:{' '}
            <Box is='span' fontScale='p2' style={{ userSelect: 'text' }}>
              {{ version: appVersion }}
            </Box>
          </Trans>
        </Box>

        {canUpdate && (
          <Box display='flex' flexDirection='column'>
            <Margins block='x8'>
              {!checkingForUpdates && (
                <Button
                  ref={checkForUpdatesButtonRef}
                  primary
                  type='button'
                  disabled={checkingForUpdates}
                  onClick={handleCheckForUpdatesButtonClick}
                >
                  {t('dialog.about.checkUpdates')}
                </Button>
              )}
            </Margins>

            <Margins inline='auto' block='x8'>
              {checkingForUpdates && (
                <Box>
                  <Margins block='x12'>
                    {checkingForUpdatesMessage ? (
                      <Box fontScale='c1' color='info'>
                        {checkingForUpdatesMessage}
                      </Box>
                    ) : (
                      <Throbber size='x16' />
                    )}
                  </Margins>
                </Box>
              )}

              <Field.Row>
                <ToggleSwitch
                  id={checkForUpdatesOnStartupToggleSwitchId}
                  checked={isCheckForUpdatesOnStartupChecked}
                  disabled={!canSetCheckForUpdatesOnStartup}
                  onChange={handleCheckForUpdatesOnStartCheckBoxChange}
                />
                <Field.Label htmlFor={checkForUpdatesOnStartupToggleSwitchId}>
                  {t('dialog.about.checkUpdatesOnStart')}
                </Field.Label>
              </Field.Row>
            </Margins>
          </Box>
        )}

        <Box alignSelf='center' fontScale='micro'>
          {t('dialog.about.copyright', { copyright })}
        </Box>
      </Margins>
    </Dialog>
  );
};
