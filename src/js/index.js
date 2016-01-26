import React from 'react'
import ReactDOM from 'react-dom'
import App from '../purs/App';

ReactDOM.render(React.createElement(App.main({
  state: App.initialState,
  update: App.update,
  view: App.view,
  inputs: []
})()), document.getElementById('app'));

// PureScript's type safety prevents hot-swapping of render functions if any
// action types are used in event handlers. Instead, we save a snapshot of every
// state change, and recreate the entire application with it everytime a module
// is hot loaded.
if (module.hot) {
  var _setState = React.Component.prototype.setState;
  React.Component.prototype.setState = function (state) {
    _setState.lastState = state.state;
    return _setState.apply(this, arguments);
  };
  module.hot.accept('../purs/App', function () {
    var App = require('../purs/App');
    ReactDOM.render(
      React.createElement(App.main({
        state: _setState.lastState,
        update: App.update,
        view: App.view,
        inputs: []
      })()),
      document.getElementById('app')
    );
  });
}
