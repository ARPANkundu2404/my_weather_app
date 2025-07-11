"use client"

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto p-8 sm:p-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 backdrop-blur-xl rounded-3xl border border-blue-200/50 dark:border-blue-800/30 shadow-2xl"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
            className="text-6xl sm:text-8xl mb-6 text-blue-500 dark:text-blue-400"
          >
            📈
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            No trend data available
          </h2>
          <p className="text-blue-700 dark:text-blue-300 text-lg">
            Search for a city to see temperature and humidity trends
          </p>
        </div>
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
      },
      {
        label: "Humidity (%)",
        data: humidityData,
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
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
          color: document.documentElement.classList.contains("dark") ? "#dbeafe" : "#1e40af",
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 64, 175, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 15,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(59, 130, 246, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#93c5fd" : "#1e40af",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(59, 130, 246, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains("dark") ? "#93c5fd" : "#1e40af",
          font: {
            size: 12,
            weight: "500",
          },
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-2xl lg:text-3xl font-bold text-white flex items-center"
          >
            <motion.span
              className="mr-4 text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
            >
              📈
            </motion.span>
            Temperature & Humidity Trends
          </motion.h3>
          <p className="text-blue-100 mt-2">Visualize weather patterns over time</p>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="h-80 w-full mb-6"
          >
            <Line data={data} options={options} />
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">{Math.max(...tempData)}°C</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Highest Temp</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                {Math.max(...humidityData)}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Highest Humidity</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">{Math.min(...tempData)}°C</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lowest Temp</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                {Math.round(tempData.reduce((a, b) => a + b, 0) / tempData.length)}°C
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Average Temp</div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TrendChart
