import { useState } from "react";
import { WEATHER_API_URL } from "../utils/constant";
import { WEATHER_API_KEY } from "../utils/constant";

const SearchBox = (setWeatherInfo) => {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleOnChage = (event) => {
    setCity(event.target.value);
    setError("");
  };

  const fetchWeatherInfo = async () => {
    setError("");
    try {
      const response = await fetch(
        `${WEATHER_API_URL}q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      if (!response.ok) {
        setError("City not found.Please enter a valid city name");
        setWeatherInfo.setWeatherInfo({});
        return;
      }
      const jsonResponse = await response.json();

      const Info = {
        name: jsonResponse.name,
        temp: jsonResponse.main.temp,
        temp_max: jsonResponse.main.temp_max,
        temp_min: jsonResponse.main.temp_min,
        humidity: jsonResponse.main.humidity,
        feels_like: jsonResponse.main.feels_like,
        icon: jsonResponse.weather[0].icon,
        description: jsonResponse.weather[0].description,
      };
      setWeatherInfo.setWeatherInfo(Info);
      setError("");
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setWeatherInfo.setWeatherInfo({});
    }
  };

  const getCurrentLocationWeather = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (postion) => {
        const { latitude, longitude } = postion.coords;
        try {
          const response = await fetch(
            `${WEATHER_API_URL}lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
          );
          if (!response.ok) {
            setError("City not found.Please enter a valid city name");
            setWeatherInfo.setWeatherInfo({});
            return;
          }
          const jsonResponse = await response.json();

          const Info = {
            name: jsonResponse.name,
            temp: jsonResponse.main.temp,
            temp_max: jsonResponse.main.temp_max,
            temp_min: jsonResponse.main.temp_min,
            humidity: jsonResponse.main.humidity,
            feels_like: jsonResponse.main.feels_like,
            icon: jsonResponse.weather[0].icon,
            description: jsonResponse.weather[0].description,
          };
          setWeatherInfo.setWeatherInfo(Info);
          setError("");
        } catch (error) {
          setError("Something went wrong. Please try again later.");
          setWeatherInfo.setWeatherInfo({});
        }
      },
      (error) => {
        setError("Something went wrong while fetching your location.");
        setWeatherInfo.setWeatherInfo({});
      }
    );
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      setWeatherInfo.setWeatherInfo({});
      return;
    }
    fetchWeatherInfo();
    setCity("");
  };
  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl shadow-xl p-6">
      <h1 className="flex justify-center items-center font-bold text-3xl text-blue-700 mb-6 drop-shadow">
        <span className="mr-2">🌦️</span> My Weather Widget
      </h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleOnSubmit}
        autoComplete="off"
      >
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border-2 border-blue-400 rounded-lg p-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="text"
            value={city}
            name="city"
            placeholder="Enter city name"
            onChange={handleOnChage}
          />
          <button
            type="button"
            onClick={getCurrentLocationWeather}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white shadow transition"
            title="Use my location"
          >
            {/* Location SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 11c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm0 8c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-14v2m0 12v2m7-7h2M3 12H1" />
            </svg>
          </button>
        </div>
        <button
          className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          type="submit"
        >
          Search
        </button>
        {error && (
          <div className="text-red-600 font-semibold text-center bg-red-100 rounded p-2 shadow">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
