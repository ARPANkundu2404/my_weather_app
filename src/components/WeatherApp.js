import SearchBox from "./SerachBox";
import WeatherCard from "./WeatherCard";
import { useState } from "react";
import ForecastCard from "./ForecastCard";
import { useSwipeable } from "react-swipeable";
import TrendChart from "./TrendChart";
import AQICard from "./AQICard";
import { WEATHER_BG_MAP, DEFAULT_BG } from "../utils/weatherBgMap";

const WeatherApp = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [forecastInfo, setForecastInfo] = useState([]);
  const [aqiInfo, setAqiInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveTab("forecast"),
    onSwipedRight: () => setActiveTab("current"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const bgFile = WEATHER_BG_MAP[weatherInfo?.main] || DEFAULT_BG;

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-tl from-blue-200 to-blue-50 p-4"
        style={{ backgroundImage: `url(${bgFile})` }}
      >
        <div className="backdrop-blur-sm bg-blue-50/40 min-h-screen p-4">
          <SearchBox
            setWeatherInfo={setWeatherInfo}
            setForecastInfo={setForecastInfo}
            setAqiInfo={setAqiInfo}
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
            {activeTab === "current" && (
              <>
                <WeatherCard Info={weatherInfo} />

                <AQICard aqi={aqiInfo?.aqi} components={aqiInfo?.components} />
              </>
            )}
            {activeTab === "forecast" && (
              <>
                <ForecastCard forecast={forecastInfo} />{" "}
                <TrendChart forecast={forecastInfo} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
