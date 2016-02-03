module State where

import Control.Monad.Eff.Console (CONSOLE(), log)
import Prelude
import Pux

data Route = Home | NotFound

data Action = Increment | Decrement | PageView Route

type State =
  { route :: Route
  , counter :: Int }

initialState :: State
initialState =
  { route: NotFound
  , counter: 0 }

update :: forall eff. Update (console :: CONSOLE | eff) State Action
update action state input =
  case action of
    PageView route ->
      { state: state { route = route }
      , effects: [] }
    Increment ->
      { state: state { counter = state.counter + 1 }
      , effects: [ do log "increment" ] }
    Decrement ->
      { state: state { counter = state.counter - 1 }
      , effects: [ do log "decrement" ] }
