export const getAQILabel = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        color: "bg-green-100",
        textColor: "text-green-800",
        emoji: "😊",
      };
    case 2:
      return {
        label: "Fair",
        color: "bg-yellow-300",
        textColor: "text-yellow-500",
        emoji: "😐",
      };
    case 3:
      return {
        label: "Moderate",
        color: "bg-yellow-500",
        textColor: "text-yellow-800",
        emoji: "😷",
      };
    case 4:
      return {
        label: "Poor",
        color: "bg-orange-500",
        textColor: "text-orange-800",
        emoji: "🤢",
      };
    case 5:
      return {
        label: "Very Poor",
        color: "bg-red-600",
        textColor: "text-red-800",
        emoji: "☠️",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-400",
        textColor: "text-gray-800",
        emoji: "❓",
      };
  }
};