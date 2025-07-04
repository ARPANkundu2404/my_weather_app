import SearchBox from "./SerachBox";
import WeatherCard from "./WeatherCard";
import { useState } from "react";
import ForecastCard from "./ForecastCard";

const WeatherApp = () => {
  const [weatherInfo, setWeatherInfo] = useState({});
  const [forecastInfo, setForecastInfo] = useState([]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tl from-blue-200 to-blue-50 p-4">
        <SearchBox setWeatherInfo={setWeatherInfo} setForecastInfo={setForecastInfo}/>
        <WeatherCard Info={weatherInfo} />
        <ForecastCard forecast={forecastInfo} />
      </div>
    </>
  );
};

export default WeatherApp;
