module Main where

import Prelude
import App.Events (AppEffects, Event(..), foldp)
import App.Routes (match)
import App.State (State, init)
import App.View.Layout (view)
import Control.Monad.Eff (Eff)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (HISTORY)
import Pux (CoreEffects, App, start)
import Pux.DOM.Events (DOMEvent)
import Pux.DOM.History (sampleURL)
import Pux.Renderer.React (renderToDOM)
import Signal ((~>))

type WebApp = App (DOMEvent -> Event) Event State

type ClientEffects = CoreEffects (AppEffects (history :: HISTORY, dom :: DOM))

main :: String -> State -> Eff ClientEffects WebApp
main url state = do
  -- | Create a signal of URL changes.
  urlSignal <- sampleURL =<< window

  -- | Map a signal of URL changes to PageView actions.
  let routeSignal = urlSignal ~> \r -> PageView (match r)

  -- | Start the app.
  app <- start
    { initialState: state
    , view
    , foldp
    , inputs: [routeSignal] }

  -- | Render to the DOM
  renderToDOM "#app" app.markup app.input

  -- | Return app to be used for hot reloading logic in support/client.entry.js
  pure app

initialState :: State
initialState = init "/"
