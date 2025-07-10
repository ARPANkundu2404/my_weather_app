import { motion } from "framer-motion"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const TrendChart = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center p-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 2,
          }}
          className="text-8xl mb-6"
        >
          📈
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300 text-center mb-4">
          No trend data available
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
          Search for a city to see temperature and humidity trends
        </p>
      </motion.div>
    )
  }

  const labels = forecast.map((item) => item.time)
  const tempData = forecast.map((item) => item.temp)
  const humidityData = forecast.map((item) => item.humidity || 0)

  const data = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: tempData,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(59, 130, 246)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(34, 197, 94)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 25,
          font: {
            size: 14,
            weight: "600",
          },
          color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#374151",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 15,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#9CA3AF" : "#6B7280",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 10,
        },
      },
      y: {
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#9CA3AF" : "#6B7280",
          font: {
            size: 12,
            weight: "500",
          },
          padding: 10,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        borderWidth: 4,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 p-6">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl lg:text-3xl font-bold text-white flex items-center"
          >
            <motion.span
              className="mr-4 text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              📈
            </motion.span>
            Temperature & Humidity Trends
          </motion.h3>
          <p className="text-cyan-100 mt-2">Visualize weather patterns over time</p>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-80 w-full mb-6"
          >
            <Line data={data} options={options} />
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{Math.max(...tempData)}°C</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Highest Temp</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50"
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {Math.max(...humidityData)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Highest Humidity</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50"
            >
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {Math.min(...tempData)}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Lowest Temp</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50"
            >
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {Math.round(tempData.reduce((a, b) => a + b, 0) / tempData.length)}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Average Temp</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TrendChart