import { promises } from 'fs';

import * as core from '@actions/core';

import { run, runElectronBuilder } from './shell';

export const packOnLinux = (): Promise<void> =>
  runElectronBuilder(`--linux tar.gz deb rpm`);
