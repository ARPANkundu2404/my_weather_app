"use client"

import { motion } from "framer-motion"
import { WEATHER_ICON_URL } from "../utils/constant"

const ForecastCard = ({ forecast }) => {
  if (!Array.isArray(forecast) || forecast.length === 0) {
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
            📅
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            No forecast available
          </h2>
          <p className="text-blue-700 dark:text-blue-300 text-lg">Search for a city to see the hourly forecast</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30 overflow-hidden">
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
              📊
            </motion.span>
            Hourly Forecast
          </motion.h3>
          <p className="text-blue-100 mt-2">Next 24 hours weather prediction</p>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4 min-w-max">
              {forecast.map((item, idx) => {
                const iconUrl = `${WEATHER_ICON_URL}${item.icon}@2x.png`
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.6, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="flex-shrink-0 w-32 sm:w-36 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 text-center shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out border border-blue-200/40 dark:border-blue-700/20 group cursor-pointer"
                  >
                    <p className="font-bold text-blue-900 dark:text-blue-100 mb-3 text-sm">{item.time}</p>

                    <motion.img
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      src={iconUrl}
                      alt="Weather icon"
                      className="mx-auto h-12 w-12 sm:h-14 sm:w-14 mb-3 drop-shadow-lg"
                    />

                    <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {item.temp}°
                    </p>

                    <p className="text-xs text-blue-700 dark:text-blue-300 capitalize leading-tight mb-3 font-medium">
                      {item.desc}
                    </p>

                    <div className="pt-3 border-t border-blue-200/30 dark:border-blue-700/30">
                      <div className="flex items-center justify-center text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        <span className="mr-1">💧</span>
                        {item.humidity}%
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ForecastCard
