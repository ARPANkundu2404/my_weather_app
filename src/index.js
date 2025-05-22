import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import WeatherApp from "./components/WeatherApp";
import "./index.css";

const App = () => {
  return (
    <StrictMode>
      <WeatherApp />
    </StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
