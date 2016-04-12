module App.Counter where

import Prelude ((+), (-), const, show)
import Pux.Html (Html, div, span, button, text)
import Pux.Html.Events (onClick)

data Action = Increment | Decrement

type State = Int

init :: State
init = 0

update :: Action -> State -> State
update Increment state = state + 1
update Decrement state = state - 1

view :: State -> Html Action
view state =
  div
    []
    [ button [ onClick (const Increment) ] [ text "Increment" ]
    , span [] [ text (show state) ]
    , button [ onClick (const Decrement) ] [ text "Decrement" ]
    ]
