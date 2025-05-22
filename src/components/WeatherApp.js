import SearchBox from "./SerachBox";
import WeatherCard from "./WeatherCard";
import { useState } from "react";

const WeatherApp = () => {
  const [weatherInfo, setWeatherInfo] = useState({});

  return (
    <>
      <div className="min-h-screen bg-gradient-to-tl from-blue-200 to-blue-50 p-4">
        <SearchBox setWeatherInfo={setWeatherInfo} />
        <WeatherCard Info={weatherInfo} />
      </div>
    </>
  );
};

export default WeatherApp;
