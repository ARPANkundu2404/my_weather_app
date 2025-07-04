import SearchBox from "./SerachBox";
import WeatherCard from "./WeatherCard";
import { useState } from "react";
import ForecastCard from "./ForecastCard";
import { useSwipeable } from "react-swipeable";

const WeatherApp = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [forecastInfo, setForecastInfo] = useState([]);
  const [activeTab, setActiveTab] = useState("current");

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveTab("forecast"),
    onSwipedRight: () => setActiveTab("current"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tl from-blue-200 to-blue-50 p-4">
        <SearchBox
          setWeatherInfo={setWeatherInfo}
          setForecastInfo={setForecastInfo}
        />
        
        <div className="flex justify-center gap-4 my-4">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === "current"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-400"
            }`}
          >
            🌤️ Current
          </button>
          <button
            onClick={() => setActiveTab("forecast")}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              activeTab === "forecast"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-400"
            }`}
          >
            📆 Forecast
          </button>
        </div>

        <div {...handlers}>
          {activeTab === "current" && <WeatherCard Info={weatherInfo} />}
          {activeTab === "forecast" && <ForecastCard forecast={forecastInfo} />}
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
