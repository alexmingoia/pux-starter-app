module App.View.HTMLWrapper where

import App.Config (config)
import CSS (CSS, margin, padding, px)
import Control.Bind (bind)
import Data.Function (($), (#))
import Data.Monoid (mempty)
import Pux.DOM.HTML (HTML)
import Pux.DOM.HTML.Attributes (key, style)
import Pux.Renderer.React (dangerouslySetInnerHTML)
import Text.Smolder.HTML (body, div, head, html, link, meta, script, title)
import Text.Smolder.HTML.Attributes (charset, content, href, id, name, rel, src, type')
import Text.Smolder.Markup (text, (!))

bodyStyle :: CSS
bodyStyle = do
  margin (0.0 #px) (0.0 #px) (0.0 #px) (0.0 #px)
  padding (0.0 #px) (0.0 #px) (0.0 #px) (0.0 #px)

htmlWrapper :: ∀ ev. String -> String -> HTML ev
htmlWrapper app_html state_json =
  html ! style bodyStyle $ do
    head do
      meta ! charset "UTF-8"
      meta ! name "viewport" ! content "width=device-width, initial-scale=1"
      title $ text config.title
      link ! rel "icon" ! type' "image/x-icon" ! href "/favicon.ico"
    body ! style bodyStyle $ do
      div ! key "app" ! id "app" ! dangerouslySetInnerHTML app_html $ mempty
      script ! key "initial_state" ! type' "text/javascript" ! dangerouslySetInnerHTML state_json $ mempty
      script ! key "js_bundle" ! type' "text/javascript" ! src "/dist/bundle.js" $ mempty
