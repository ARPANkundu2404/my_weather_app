import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const TrendChart = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  const labels = forecast.map((item) => item.time);
  const tempData = forecast.map((item) => item.temp);
  const humidityData = forecast.map((item) => item.humidity || 0); // Optional

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempData,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-64 sm:h-80 p-4 bg-white shadow rounded mt-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendChart;
