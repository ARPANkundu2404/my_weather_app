"use client"

import { motion } from "framer-motion"
import { getAQILabel } from "../utils/aqiLabel"

const AQICard = ({ aqi, components }) => {
  if (!aqi) {
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
            🌬️
          </motion.div>
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">
            No air quality data available
          </h3>
        </div>
      </motion.div>
    )
  }

  const { label, color, textColor, emoji } = getAQILabel(aqi)
  const healthAlert = aqi >= 4

  const pollutants = [
    {
      name: "PM2.5",
      value: components?.pm2_5,
      unit: "µg/m³",
      icon: "🔴",
      bgColor: "from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20",
    },
    {
      name: "PM10",
      value: components?.pm10,
      unit: "µg/m³",
      icon: "🟠",
      bgColor: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20",
    },
    {
      name: "CO",
      value: components?.co,
      unit: "µg/m³",
      icon: "🟡",
      bgColor: "from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20",
    },
    {
      name: "NO₂",
      value: components?.no2,
      unit: "µg/m³",
      icon: "🔵",
      bgColor: "from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20",
    },
    {
      name: "O₃",
      value: components?.o3,
      unit: "µg/m³",
      icon: "🟢",
      bgColor: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20",
    },
    {
      name: "SO₂",
      value: components?.so2,
      unit: "µg/m³",
      icon: "🟣",
      bgColor: "from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20",
    },
  ]

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                <motion.span
                  className="mr-4 text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
                >
                  🌬️
                </motion.span>
                Air Quality Index
              </h3>
              <p className="text-blue-100 mt-2">Real-time air pollution monitoring</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, ease: "easeOut" }}
                className="flex items-center space-x-3"
              >
                <span className="text-4xl">{emoji}</span>
                <div>
                  <div className="text-4xl font-bold text-white">{aqi}</div>
                  <div className="text-sm font-semibold text-blue-100">{label}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          {/* Health Alert */}
          {healthAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border border-red-200/50 dark:border-red-800/30 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-red-800 dark:text-red-400 text-lg">Health Alert</h4>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    Poor air quality detected. Consider limiting outdoor activities and wearing a mask when outside.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pollutants Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {pollutants.map((pollutant, index) => (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`bg-gradient-to-br ${pollutant.bgColor} backdrop-blur-sm rounded-2xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-500 ease-in-out group cursor-pointer border border-white/20 dark:border-gray-600/20`}
              >
                <motion.div
                  className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300 ease-in-out"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {pollutant.icon}
                </motion.div>
                <div className="font-bold text-gray-800 dark:text-white text-sm mb-1">{pollutant.name}</div>
                <div className="text-lg font-bold text-gray-700 dark:text-gray-200">{pollutant.value || "N/A"}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pollutant.unit}</div>
              </motion.div>
            ))}
          </div>

          {/* Status Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            className={`p-6 ${color} ${textColor} rounded-2xl border border-opacity-50 shadow-lg`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {aqi <= 2 ? (
                  <svg className="h-6 w-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-lg">Air Quality Status: {label}</h4>
                <p className="mt-1 leading-relaxed">
                  {aqi <= 2
                    ? "Air quality is good. Perfect for outdoor activities and exercise!"
                    : aqi === 3
                      ? "Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor activities."
                      : "Air quality is poor. Everyone should limit outdoor activities and consider wearing a mask when outside."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default AQICard
