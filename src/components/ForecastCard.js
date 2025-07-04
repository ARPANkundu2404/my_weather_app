import { WEATHER_ICON_URL } from "../utils/constant";

const ForecastCard = ({ forecast, activeTab, setActiveTab }) => {
  if (!Array.isArray(forecast) || forecast.length === 0) return null;

  return (
    

      <div className="bg-blue-100 p-4 mt-4 rounded-md shadow-md overflow-x-auto whitespace-nowrap flex gap-4">
        {forecast.map((item, idx) => {
          const iconUrl = `${WEATHER_ICON_URL}${item.icon}@2x.png`;
          return (
            <div
              key={idx}
              className="min-w-[150px] bg-white p-2 rounded shadow-md text-center"
            >
              <p className="font-semibold">{item.time}</p>
              <img
                src={iconUrl}
                alt="Weather icon"
                className="mx-auto h-10 w-10"
              />
              <p>{item.temp}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          );
        })}
      </div>
    
  );
};

export default ForecastCard;
