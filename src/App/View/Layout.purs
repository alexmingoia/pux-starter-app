module App.View.Layout where

import App.View.Homepage as Homepage
import App.View.NotFound as NotFound
import App.Routes (Route(NotFound, Home))
import App.State (State(..))
import App.Events (Event)
import CSS ((?))
import CSS.Background (backgroundImage, backgroundPosition, backgroundRepeat, backgroundSize, by, noRepeat, placed, sideCenter, url)
import CSS.Font (color, fontFamily, sansSerif)
import CSS.Geometry (paddingTop)
import CSS.Overflow (hidden, overflow)
import CSS.Size (px)
import CSS.String (fromString)
import CSS.Text (noneTextDecoration, textDecoration, underline)
import CSS.TextAlign (center, textAlign)
import Color (rgb)
import Control.Bind (bind)
import Data.Function (($), (#))
import Data.NonEmpty (singleton)
import Pux.DOM.HTML (HTML, style)
import Text.Smolder.HTML (div)
import Text.Smolder.HTML.Attributes (className)
import Text.Smolder.Markup ((!))

view :: State -> HTML Event
view (State st) =
  div ! className "app" $ do
    style do
      fromString "body" ? do
        fontFamily ["Source Sans Pro", "Open Sans Pro"] (singleton sansSerif)
        textAlign center

      fromString "a" ? do
        color (rgb 134 133 220)
        textDecoration noneTextDecoration

      fromString "a:hover" ? do
        textDecoration underline

      fromString "h1" ? do
        backgroundImage (url "/purescript.png")
        backgroundPosition (placed sideCenter sideCenter)
        backgroundSize (by (100.0 #px) (100.0 #px))
        backgroundRepeat noRepeat
        overflow hidden
        paddingTop (120.0 #px)

    case st.route of
      (Home) -> Homepage.view (State st)
      (NotFound url) -> NotFound.view (State st)
