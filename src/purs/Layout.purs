module App.Layout where

import App.Counter as Counter
import App.Routes (Route(Home, NotFound))
import Prelude (($))
import Pux.Html (Html, (#), bind, forwardTo, div, h1, p, text)

data Action
  = Child (Counter.Action)
  | PageView Route

type State =
  { route :: Route
  , count :: Counter.State }

init :: State
init =
  { route: NotFound
  , count: Counter.init }

update :: Action -> State -> State
update (PageView route) state = state { route = route }
update (Child action) state = state { count = Counter.update action state.count }

view :: State -> Html Action
view state =
  div # do
    h1 # text "Pux Starter App"
    p # text "Change me in src/purs/Layout.purs and watch me hot-reload."
    case state.route of
      Home -> forwardTo Child $ Counter.view state.count
      NotFound -> App.NotFound.view state
