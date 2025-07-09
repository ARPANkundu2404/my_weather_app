import SearchBox from "./SerachBox";
import WeatherCard from "./WeatherCard";
import { useState } from "react";
import ForecastCard from "./ForecastCard";
import { useSwipeable } from "react-swipeable";
import TrendChart from "./TrendChart";
import AQICard from "./AQICard";
import { WEATHER_BG_MAP, DEFAULT_BG } from "../utils/weatherBgMap";
import AlertSettings from "./AlertSettings";
import WeatherTips from "./WeatherTips";
import HistoryChart from "./HistoricalChart";
import SettingsPage from "./SettingPage";

const WeatherApp = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [forecastInfo, setForecastInfo] = useState([]);
  const [aqiInfo, setAqiInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("current");
  const [alertSettings, setAlertSettings] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveTab("forecast"),
    onSwipedRight: () => setActiveTab("current"),
    onSwiped: () => setActiveTab("history"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const bgFile = WEATHER_BG_MAP[weatherInfo?.main] || DEFAULT_BG;

  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${bgFile})` }}
      >
        <div className="backdrop-blur-sm bg-blue-50/40 min-h-screen p-4">
          <SearchBox
            setWeatherInfo={setWeatherInfo}
            setForecastInfo={setForecastInfo}
            setAqiInfo={setAqiInfo}
          />

          <button
            onClick={() => {
              setShowSettings(true);
              setAlertSettings(false);
            }}
            className="absolute top-4 right-4 p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-100 transition"
            title="Settings"
          >
            ⚙️
          </button>

          <div className="flex justify-center gap-4 my-4">
            <button
              onClick={() => {
                setActiveTab("current");
                setAlertSettings(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === "current"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-400"
              }`}
            >
              🌤️ Current
            </button>
            <button
              onClick={() => {
                setActiveTab("forecast");
                setAlertSettings(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === "forecast"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-400"
              }`}
            >
              📆 Forecast
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                setAlertSettings(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === "history"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-400"
              }`}
            >
              📊History
            </button>
            <button
              onClick={() => setAlertSettings(true)}
              className="p-2 rounded-full font-semibold bg-blue-400 text-white shadow transition hover:bg-blue-600"
            >
              🧷
            </button>
          </div>

          <div {...handlers}>
            { showSettings ? (
              <SettingsPage onClose={() => setShowSettings(false)} />
            ) : alertSettings ? (
              <AlertSettings onClose={() => setAlertSettings(false)} />
            ) : (
              <>
                {activeTab === "current" && (
                  <>
                    <WeatherCard Info={weatherInfo} />
                    <WeatherTips weatherType={weatherInfo?.main} />

                    <AQICard
                      aqi={aqiInfo?.aqi}
                      components={aqiInfo?.components}
                    />
                  </>
                )}
                {activeTab === "forecast" && (
                  <>
                    <ForecastCard forecast={forecastInfo} />{" "}
                    <TrendChart forecast={forecastInfo} />
                  </>
                )}
                {activeTab === "history" && (
                  <>
                    <HistoryChart />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherApp;
