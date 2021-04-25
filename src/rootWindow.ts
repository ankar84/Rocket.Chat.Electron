import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { initializeI18next } from './common/i18n/initializeI18next';
import { setupRendererErrorHandling } from './errors';
import { createRendererReduxStore } from './store';
import { App } from './ui/components/App';
import { whenReady } from './whenReady';

const start = async (): Promise<void> => {
  const reduxStore = await createRendererReduxStore();

  await whenReady();

  setupRendererErrorHandling('rootWindow');

  const appLocale = reduxStore.getState().app.locale;
  if (appLocale === null) {
    throw new Error('app locale was not set');
  }

  await initializeI18next(appLocale);

  (
    await Promise.all([
      import('./notifications/renderer'),
      import('./servers/renderer'),
    ])
  ).forEach((module) => module.default());

  const container = document.getElementById('root');

  if (!container) {
    throw new Error('cannot find the container node for React');
  }

  render(createElement(App, { reduxStore }), container);

  window.addEventListener('beforeunload', () => {
    unmountComponentAtNode(container);
  });
};

start();
