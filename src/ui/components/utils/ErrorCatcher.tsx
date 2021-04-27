import { Component, ReactNode, ErrorInfo } from 'react';

import * as appActions from '../../../common/actions/appActions';
import { dispatch } from '../../../store';

export class ErrorCatcher extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error);
    console.error(errorInfo.componentStack);
    dispatch(appActions.errorThrown(error));
  }

  render(): ReactNode {
    return this.props.children ?? null;
  }
}
