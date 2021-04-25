import { i18n } from 'i18next';
import React, { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Store } from 'redux';

import App from './App';

type AppProps = {
  reduxStore: Store;
  i18n: i18n;
};

const AppRoot = ({ reduxStore, i18n }: AppProps): ReactElement => (
  <Provider store={reduxStore}>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </Provider>
);

export default AppRoot;
