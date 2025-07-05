import { color } from "chart.js/helpers";

export const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?";
export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
export const WEATHER_API_IMG_URL = "https://png.pngtree.com/png-vector/20220608/ourlarge/pngtree-simple-weather-icon-outline-filled-colorful-forecast-sing-with-blue-cloud-png-image_4933942.png";
export const WEATHER_ICON_URL = "https://openweathermap.org/img/wn/";
export const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast?";
export const CURRENT_LOCATION_API_URL = "http://api.openweathermap.org/geo/1.0/reverse?";
export const AQI_API_URL = "http://api.openweathermap.org/data/2.5/air_pollution?";

export const getAQILabel = (aqi) => {
    switch (aqi) {
        case 1:
            return {label: "Good", color: "bg-green-100", textColor: "text-green-800", emoji: "😊"};
        case 2:
            return { label: "Fair", color: "bg-yellow-300", textColor: "text-yellow-500", emoji: "😐" };
        case 3:
            return { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-800", emoji: "😷" };
        case 4:
            return { label: "Poor", color: "bg-orange-500", textColor: "text-orange-800", emoji: "🤢" };
        case 5:
            return { label: "Very Poor", color: "bg-red-600", textColor: "text-red-800", emoji: "☠️" };
        default:
            return { label: "Unknown", color: "bg-gray-400", textColor: "text-gray-800", emoji: "❓" };
    }
};