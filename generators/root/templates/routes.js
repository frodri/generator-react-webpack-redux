/*
 * Populated by react-webpack-redux:container
 *
 * CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
*/
import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router'
import App from '../containers/App';

class RouteComponent extends React.Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={this.props.history}>
           <Route path="/" component={App}/>
        </Router>
      </Provider>
    );
  }
}

export default RouteComponent;