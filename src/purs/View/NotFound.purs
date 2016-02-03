module View.NotFound where

import Prelude hiding (div)
import Pux
import Pux.DOM.HTML.Elements (div, h2, text)

import State

notFound :: State -> VirtualDOM
notFound state = div $ do
  h2 $ text "404 Not Found"
