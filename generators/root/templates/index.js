import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './stores';

import RouteComponent from './routes';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <RouteComponent store={store} history={history}/>,
  document.getElementById('app')
);
