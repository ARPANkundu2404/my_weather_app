import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { HISTORICAL_DB_API_URL, HISTORY_API_KEY } from "../utils/constant";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const HistoryChart = () => {
  const [historyData, setHistoryData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    const city = localStorage.getItem("searchCity");

    if (!city || !startDate || !endDate) {
      setError("Please provide city, start date, and end date.");
      return;
    }

    const url = `${HISTORICAL_DB_API_URL}${city}/${startDate}/${endDate}?unitGroup=metric&key=${HISTORY_API_KEY}&contentType=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.days) {
        setError("Failed to load historical weather data.");
        return;
      }

      // Flatten hours from multiple days
      const hourly = data.days.flatMap((day) =>
        day.hours.map((hour) => ({
          datetime: `${day.datetime} ${hour.datetime}`,
          temp: hour.temp,
          humidity: hour.humidity,
        }))
      );

      setHistoryData(hourly);
      setError("");
    } catch (err) {
      setError("Error fetching historical weather data.");
    }
  };

  const chartData = {
    labels: historyData.map((h) => h.datetime),
    datasets: [
      {
        label: "Temperature (°C)",
        data: historyData.map((h) => h.temp),
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Humidity (%)",
        data: historyData.map((h) => h.humidity),
        borderColor: "#ff6384",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        📊 Historical Weather Trends (by City)
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={fetchHistory}
          className="self-end mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
        >
          Load Data
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {historyData.length > 0 && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 12,
                  callback: function (val, index) {
                    return historyData[index]?.datetime.split(" ")[1];
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default HistoryChart;
