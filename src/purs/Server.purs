module Server where

import Prelude
import Pux
import Signal

import State (update)
import Routes (match)
import View.Layout (layout)

main url state =  app
  { state: state { route = match url }
  , update: update
  , view: layout
  , inputs: [] }
