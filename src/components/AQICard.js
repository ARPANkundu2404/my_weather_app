import { getAQILabel } from "../utils/aqiLabel";

const AQICard = ({ aqi, components }) => {
  if (!aqi) return null;

  const { label, color, textColor, emoji } = getAQILabel(aqi);

  const healthAlert = aqi >= 4;

  return (
    <div
      className={`w-full max-w-md mx-auto mt-4 p-4 rounded shadow ${color} ${textColor}`}
    >
      <h2 className="text-xl font-semibold flex items-center justify-between">
        Air Quality Index: {aqi} {emoji}
      </h2>
      <p className="text-md font-medium">Status: {label}</p>

      {healthAlert && (
        <div className="mt-2 p-2 bg-red-600 rounded shadow text-sm font-semibold">
          ⚠️ Alert: Poor air quality. Avoid outdoor activity.
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>PM2.5: {components?.pm2_5} µg/m³</div>
        <div>PM10: {components?.pm10} µg/m³</div>
        <div>CO: {components?.co} µg/m³</div>
        <div>NO₂: {components?.no2} µg/m³</div>
        <div>O₃: {components?.o3} µg/m³</div>
        <div>SO₂: {components?.so2} µg/m³</div>
        <div>NH₃: {components?.nh3} µg/m³</div>
        <div>NO: {components?.no} µg/m³</div>
      </div>
    </div>
  );
};

export default AQICard;
