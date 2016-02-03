module Routes where

import Data.Functor
import Data.Maybe
import Prelude
import Pux.Router (end, router)
import State

match :: String -> Action
match url = PageView $ fromMaybe NotFound $ router url $
  Home <$ end
