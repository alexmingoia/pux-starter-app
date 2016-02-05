module Client where

import Prelude
import Pux
import Pux.Router
import Signal

import State (update, Action(..))
import Routes (match)
import View.Layout (layout)

main state = do
  -- | Create a signal of URL changes.
  urlSignal <- sampleUrl

  -- | Map a signal of URL changes to PageView actions.
  let routeSignal = urlSignal ~> \r -> PageView (match r)

  app
    { state: state
    , update: update
    , view: layout
    , inputs: [routeSignal] }
