import React from 'react';
import Client from '../purs/Client';
import Server from '../purs/Server';
import { initialState } from '../purs/State';

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
