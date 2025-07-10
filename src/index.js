import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import WeatherApp from "./components/WeatherApp"
import i18n from "./i18n/i18n"
import "./index.css"

// Ensure i18n is initialized before rendering
const App = () => {
  return (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <WeatherApp />
      </I18nextProvider>
    </StrictMode>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"))

// Wait for i18n to be ready before rendering
i18n.on("initialized", () => {
  root.render(<App />)
})

// Fallback in case initialized event doesn't fire
setTimeout(() => {
  if (!document.getElementById("root").hasChildNodes()) {
    root.render(<App />)
  }
}, 100)
