module Main where

import App.Routes (match)
import App.Layout (Action(PageView), State, view, update)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Exception (EXCEPTION)
import DOM (DOM)
import Prelude (bind, return)
import Pux (App, fromSimple, start, renderToDOM, renderToString)
import Pux.Router (sampleUrl)
import Signal ((~>))
import Signal.Channel (CHANNEL)

type AppEffects eff = (err :: EXCEPTION, channel :: CHANNEL | eff)

-- | Entry point for the browser.
client :: State -> Eff (AppEffects (dom :: DOM)) (App State Action)
client state = do
  -- | Create a signal of URL changes.
  urlSignal <- sampleUrl

  -- | Map a signal of URL changes to PageView actions.
  let routeSignal = urlSignal ~> \r -> PageView (match r)

  app <- start
    { initialState: state
    , update: fromSimple update
    , view: view
    , inputs: [routeSignal] }

  renderToDOM "#app" app.html

  return app

-- | Entry point for the server.
server :: forall eff. String -> State -> Eff (AppEffects eff) String
server url state = do
  app <- start
    { initialState: state { route = match url }
    , update: fromSimple update
    , view: view
    , inputs: [] }

  renderToString app.html
