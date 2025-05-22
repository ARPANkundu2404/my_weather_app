import { WEATHER_ICON_URL } from "../utils/constant";
import { WEATHER_API_IMG_URL } from "../utils/constant";

const WeatherCard = ({ Info }) => {
  if (Object.keys(Info).length === 0) {
    return (
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-blue-500">
          Please search for a city
        </h1>
      </div>
    );
  }
  const {
    name,
    temp,
    temp_max,
    temp_min,
    feels_like,
    humidity,
    description,
    icon,
  } = Info;

  const iconUrl = `${WEATHER_ICON_URL}${icon}@2x.png`;

  return (
    <div className=" flex flex-col justify-center items-center max-w-auto mx-auto">
      <img
        className="h-40 w-40 rounded-full bg-blue-100 shadow-lg shadow-blue-950/50 my-4"
        src={WEATHER_API_IMG_URL}
        alt="Weather image"
      />
      <div className="p-4 bg-blue-100 rounded-md space-y-2 shadow-lg shadow-blue-950/50 mx-4 flex flex-col justify-center items-center text-wrap font-medium text-lg">
        <h2 className="flex items-center gap-2">
          City : {name} - {description}
          <img
            className="h-14 w-14 rounded-full shadow-sm"
            src={iconUrl}
            alt="Weather icon"
          />
        </h2>
        <h3>Temperature : {temp}</h3>
        <h3>Minimum Temperature : {temp_min}</h3>
        <h3>Maximum Temperature : {temp_max}</h3>
        <h3>Feels Like : {feels_like}</h3>
        <h3>Humidity : {humidity}</h3>
      </div>
    </div>
  );
};

export default WeatherCard;
