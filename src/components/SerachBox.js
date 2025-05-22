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

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setCity("");
    fetchWeatherInfo();
  };
  return (
    <div className="">
      <h1 className="flex justify-center items-center font-bold text-3xl text-blue-400 p-3">
        My Weather Widget
      </h1>
      <form
        className="flex flex-col justify-center items-center p-3"
        onSubmit={(event) => {
          handleOnSubmit(event);
        }}
      >
        <label htmlFor="city" className="font-semibold text-xl text-blue-500">
          Search for a city
        </label>
        <input
          className="border-2 border-blue-500 rounded-md p-2 m-2 hover:bg-blue-200 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="text"
          value={city}
          name="city"
          onChange={(event) => {
            handleOnChage(event);
          }}
        />
        <input
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="submit"
          value="submit"
        />
        {error && (
          <div className="text-red-500 font-semibold mt-2 p-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default SearchBox;
