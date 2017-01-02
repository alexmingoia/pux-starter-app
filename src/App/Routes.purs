module App.Routes where

import Data.Function (($))
import Data.Functor ((<$))
import Data.Generic (class Generic, gShow)
import Data.Maybe (fromMaybe)
import Data.Show (class Show)
import Pux.Router (end, router)

data Route = Home | NotFound String

derive instance genericRoute :: Generic Route

instance showRoute :: Show Route where
  show = gShow

match :: String -> Route
match url = fromMaybe (NotFound url) $ router url $
  Home <$ end

toURL :: Route -> String
toURL (NotFound url) = url
toURL (Home) = "/"
