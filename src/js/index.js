var Main = require('../purs/Main.purs');
var initialState = require('../purs/Layout.purs').init;

// The same webpack bundle is used for both client and server. This file serves
// as the webpack entry-point and uses different rendering methods for browser
// and node environments.
if (typeof window === 'undefined') {
  module.exports = function (url) {
    return Main.server(url)(initialState)();
  };
} else {
  var app = Main.client(window.puxLastState || initialState)();
  app.state.subscribe(function (state) {
    window.puxLastState = state;
  });

  if (module.hot) {
    module.hot.accept();
  }
}
