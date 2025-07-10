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
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(34, 197, 94)",
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
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(156, 163, 175, 0.2)",
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 12,
          color: document.documentElement.classList.contains("dark") ? "#9CA3AF" : "#6B7280",
          font: {
            size: 11,
            weight: "500",
          },
          callback: (val, index) => historyData[index]?.datetime.split(" ")[1] || "",
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
      className="w-full max-w-7xl mx-auto"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
              className="p-3 bg-white/20 rounded-2xl"
            >
              <span className="text-3xl">📊</span>
            </motion.div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">Historical Weather Trends</h2>
              <p className="text-purple-100 mt-2 text-lg">Analyze weather patterns over time</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
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
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-gray-800 dark:text-white text-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
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
                className="w-full px-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-gray-800 dark:text-white text-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={fetchHistory}
                disabled={loading || !startDate || !endDate}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 mx-8 mt-6 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-2xl backdrop-blur-sm"
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
                <span className="text-red-700 dark:text-red-400 font-bold text-lg">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart */}
        {historyData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="p-8"
          >
            <div className="h-96 w-full mb-8">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {Math.round(historyData.reduce((sum, item) => sum + item.temp, 0) / historyData.length)}°C
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Average Temp</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50"
              >
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {Math.round(historyData.reduce((sum, item) => sum + item.humidity, 0) / historyData.length)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Average Humidity</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50"
              >
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {Math.max(...historyData.map((item) => item.temp))}°C
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Max Temp</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50"
              >
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {Math.min(...historyData.map((item) => item.temp))}°C
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Min Temp</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && historyData.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-16"
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
              📊
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-600 dark:text-gray-300 text-center mb-4">No Historical Data</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg text-center max-w-md">
              Select a date range and click "Load Data" to view historical weather trends for your searched city
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default HistoryChart
