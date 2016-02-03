module Client where

import Prelude
import Pux
import Pux.Router
import Signal

import State (update)
import Routes (match)
import View.Layout (layout)

main state = do
  urlSignal <- sampleUrl
  let routeSignal = urlSignal ~> match

  app
    { state: state
    , update: update
    , view: layout
    , inputs: [routeSignal] }
