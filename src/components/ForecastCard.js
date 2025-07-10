import { motion } from "framer-motion"
import { WEATHER_ICON_URL } from "../utils/constant"

const ForecastCard = ({ forecast }) => {
  if (!Array.isArray(forecast) || forecast.length === 0) {
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
          📅
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300 text-center mb-4">No forecast available</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg text-center">
          Search for a city to see the hourly forecast
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-6">
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
              📊
            </motion.span>
            Hourly Forecast
          </motion.h3>
          <p className="text-indigo-100 mt-2">Next 24 hours weather prediction</p>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4 min-w-max">
              {forecast.map((item, idx) => {
                const iconUrl = `${WEATHER_ICON_URL}${item.icon}@2x.png`
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="flex-shrink-0 w-36 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 group cursor-pointer"
                  >
                    <p className="font-bold text-gray-800 dark:text-white mb-3 text-sm">{item.time}</p>

                    <motion.img
                      whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={iconUrl}
                      alt="Weather icon"
                      className="mx-auto h-14 w-14 mb-3 drop-shadow-lg"
                    />

                    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.temp}°
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-300 capitalize leading-tight mb-3 font-medium">
                      {item.desc}
                    </p>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-500">
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
