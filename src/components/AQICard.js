import { getAQILabel } from "../utils/constant";

const AQICard = ({ aqi }) => {
  if (!aqi) return null;

  const { label, color, textColor, emoji } = getAQILabel(aqi);

  return (
    <div
      className={`w-full max-w-md mx-auto mt-4 p-4 rounded shadow ${color} ${textColor}`}
    >
      <h2 className="text-xl font-semibold flex items-center justify-between">
        Air Quality Index: {aqi} {emoji}
      </h2>
      <p className="text-md font-medium">Status: {label}</p>
    </div>
  );
};

export default AQICard;
