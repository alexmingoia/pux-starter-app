module App.Routes where

import Data.Functor ((<$))
import Data.Maybe (fromMaybe)
import Prelude (($))
import Pux.Router (end, router)

data Route = Home | NotFound

match :: String -> Route
match url = fromMaybe NotFound $ router url $
  Home <$ end
