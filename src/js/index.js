import React from 'react';
import Client from '../purs/Client';
import Server from '../purs/Server';
import { initialState } from '../purs/State';

// The same webpack bundle is used for both client and server. This file serves
// as the webpack entry and uses different rendering methods for browser and
// node environments.
//
// Each rendering method is provided by a purescript entry point. The `Client`
// entry point takes an initial state, which is used to inject the previous
// state when hot-reloading. The `Server` entry point takes the initial state
// and the current URL, which is used to determine the appropriate route when
// rendering on the server.
if (typeof window === 'undefined') {
  module.exports = function (url) {
    return require('react-dom/server').renderToString(
      React.createElement(Server.main(url)(initialState)()));
  };
} else {
  require('react-dom').render(
    React.createElement(Client.main(window.puxLastState || initialState)()),
    document.getElementById('app'));
}
