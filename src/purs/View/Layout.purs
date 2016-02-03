module View.Layout where

import Prelude hiding (div)
import Pux
import Pux.DOM.HTML.Elements (div, h1, text)

import State
import View.Home (home)
import View.NotFound (notFound)

layout :: State -> VirtualDOM
layout state = div $ do
  h1 $ text "Pux Boilerplate"
  case state.route of
    Home -> home state
    NotFound -> notFound state
