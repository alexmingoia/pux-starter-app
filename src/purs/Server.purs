module Server where

import Prelude
import Pux
import Signal

import State (update)
import Routes (match)
import View.Layout (layout)

main url state = do
  let routeSignal = constant url ~> match

  app
    { state: state
    , update: update
    , view: layout
    , inputs: [routeSignal] }
