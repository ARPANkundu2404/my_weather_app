"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { HISTORICAL_DB_API_URL, HISTORY_API_KEY } from "../utils/constant"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler)

const HistoryChart = () => {
  const [historyData, setHistoryData] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    const city = localStorage.getItem("searchCity")

    if (!city || !startDate || !endDate) {
      setError("Please provide city, start date, and end date.")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date.")
      return
    }

    setLoading(true)
    setError("")

    const url = `${HISTORICAL_DB_API_URL}${city}/${startDate}/${endDate}?unitGroup=metric&key=${HISTORY_API_KEY}&contentType=json`

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (!data || !data.days) {
        setError("Failed to load historical weather data.")
        return
      }

      const hourly = data.days.flatMap((day) =>
        day.hours.map((hour) => ({
          datetime: `${day.datetime} ${hour.datetime}`,
          temp: hour.temp,
          humidity: hour.humidity,
        })),
      )

      setHistoryData(hourly)
    } catch (err) {
      setError("Error fetching historical weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const chartData = {
    labels: historyData.map((h) => {
      const date = new Date(h.datetime)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }),
    datasets: [
      {
        label: "Temperature (°C)",
        data: historyData.map((h) => h.temp),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Humidity (%)",
        data: historyData.map((h) => h.humidity),
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointBorderColor: "white",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const chartOptions = {
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
          maxTicksLimit: 12,
          color: document.documentElement.classList.contains("dark") ? "#93c5fd" : "#1e40af",
          font: {
            size: 11,
            weight: "500",
          },
          callback: (val, index) => historyData[index]?.datetime.split(" ")[1] || "",
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
      className="w-full max-w-7xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 sm:p-8">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4, ease: "easeInOut" }}
              className="p-3 bg-white/20 rounded-2xl"
            >
              <span className="text-3xl">📊</span>
            </motion.div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Historical Weather Trends</h2>
              <p className="text-blue-100 mt-2 text-base sm:text-lg">Analyze weather patterns over time</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 sm:p-8 border-b border-blue-200/30 dark:border-blue-700/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Start Date
                </span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/40 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-500 ease-in-out text-blue-900 dark:text-blue-100 text-base sm:text-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  End Date
                </span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/40 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-500 ease-in-out text-blue-900 dark:text-blue-100 text-base sm:text-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchHistory}
                disabled={loading || !startDate || !endDate}
                className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Load Data</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6 mx-6 sm:mx-8 mt-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-800/30 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 dark:text-red-400 font-bold text-base sm:text-lg">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart */}
        {historyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="p-6 sm:p-8"
          >
            <div className="h-80 sm:h-96 w-full mb-8">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                className="text-center p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {Math.round(historyData.reduce((sum, item) => sum + item.temp, 0) / historyData.length)}°C
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Average Temp</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                className="text-center p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {Math.round(historyData.reduce((sum, item) => sum + item.humidity, 0) / historyData.length)}%
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Average Humidity</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                className="text-center p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {Math.max(...historyData.map((item) => item.temp))}°C
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Max Temp</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                className="text-center p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
              >
                <div className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {Math.min(...historyData.map((item) => item.temp))}°C
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">Min Temp</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && historyData.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-12 sm:p-16"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="text-6xl sm:text-8xl mb-6 text-blue-500 dark:text-blue-400"
            >
              📊
            </motion.div>
            <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 text-center mb-4">
              No Historical Data
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-base sm:text-lg text-center max-w-md">
              Select a date range and click "Load Data" to view historical weather trends for your searched city
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default HistoryChart
