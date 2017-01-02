module Server where

import App.Config (config)
import App.Events (AppEffects, Event(..), foldp)
import App.Routes (Route(..), match)
import App.State (State(..), init)
import App.View.HTMLWrapper (htmlWrapper)
import App.View.Layout (view)
import Control.Bind (bind)
import Control.Monad.Aff.Class (liftAff)
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Class (liftEff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Control.Monad.Eff.Exception (Error, message)
import Control.Monad.Eff.Ref (REF)
import Data.Argonaut.Core (stringify)
import Data.Argonaut.Encode (encodeJson)
import Data.Foldable (for_)
import Data.Function (($), (<<<))
import Data.Function.Uncurried (Fn3)
import Data.Functor ((<$>))
import Data.Int (fromString)
import Data.Maybe (fromMaybe)
import Data.Semigroup ((<>))
import Data.Show (show)
import Data.Unit (Unit)
import Node.Express.App (listenHttp, use, useExternal, useOnError)
import Node.Express.Handler (Handler)
import Node.Express.Middleware.Static (static)
import Node.Express.Request (getOriginalUrl)
import Node.Express.Response (send, sendJson, setStatus)
import Node.Express.Types (EXPRESS, Request, Response, ExpressM)
import Node.HTTP (Server)
import Node.Process (PROCESS, lookupEnv)
import Pux (CoreEffects, start, waitState)
import Pux.Renderer.React (renderToString, renderToStaticMarkup)
import Signal (constant)

-- | Express route handler which renders the application.
appHandler :: ∀ fx. Handler (CoreEffects (AppEffects fx))
appHandler = do
  let getState (State st) = st

  url <- getOriginalUrl

  -- | Start the app.
  app <- liftEff $ start
    { initialState: init url
    , view
    , foldp
    , inputs: [constant (PageView (match url))]
    }

  -- | Wait for async effects before rendering
  state <- liftAff $ waitState (\(State st) -> st.loaded) app

  -- | Set proper response status
  case (getState state).route of
    (NotFound _) -> setStatus 404
    _ -> setStatus 200

  -- | Inject state JSON into HTML response.
  html <- liftEff do
    let state_json = "window.__puxInitialState = "
                   <> (stringify (encodeJson state))
                   <> ";"

    app_html <- renderToString app.markup
    renderToStaticMarkup $ constant (htmlWrapper app_html state_json)

  send html

errorHandler :: forall e. Error -> Handler e
errorHandler err = do
  setStatus 500
  sendJson {error: message err}

type ExternalHandler = ∀ e. Fn3 Request Response (ExpressM e Unit) (ExpressM e Unit)

-- | Starts server (for development).
main :: Array ExternalHandler -> Eff (CoreEffects (AppEffects (ref :: REF, express :: EXPRESS, console :: CONSOLE, process :: PROCESS))) Server
main middleware = do
  port <- (fromMaybe 0 <<< fromString <<< fromMaybe "3000") <$> lookupEnv "PORT"

  let app = do
        for_ middleware \m -> useExternal m
        use         (static config.public_path)
        use         appHandler
        useOnError  errorHandler

  listenHttp app port \_ ->
    log $ "Listening on " <> show port
