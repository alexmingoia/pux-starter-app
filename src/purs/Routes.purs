module Routes where

import Data.Functor
import Data.Maybe
import Prelude
import Pux.Router (end, router)
import State

match :: String -> Route
match url = fromMaybe NotFound $ router url $
  Home <$ end
