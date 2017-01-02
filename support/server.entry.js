const ServerEntry = require('../src/Server.purs');

if (process.env.NODE_ENV === 'production') {
  ServerEntry.main([])();
} else {
  module.exports = ServerEntry.main;
}
