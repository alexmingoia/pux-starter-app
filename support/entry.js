let ClientEntry = require('../src/Main.purs');
let app = ClientEntry.main(window.location.pathname)(window.__puxLastState || ClientEntry.initialState)()

app.state.subscribe((state) => {
 window.__puxLastState = state;
});

// If hot-reloading, hook into each state change and re-render using the last
// state.
if (module.hot) {
  module.hot.accept();
}
