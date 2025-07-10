import { motion } from "framer-motion"
import { WEATHER_ICON_URL } from "../utils/constant"

const WeatherCard = ({ Info }) => {
  if (!Info || Object.keys(Info).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
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
          🔍
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-600 dark:text-gray-300 text-center mb-4">
          Ready to explore weather?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg text-center max-w-md">
          Enter a city name above to discover current weather conditions and forecasts
        </p>
      </motion.div>
    )
  }

  const { name, temp, temp_max, temp_min, feels_like, humidity, description, icon, wind_speed, pressure } = Info
  const iconUrl = `${WEATHER_ICON_URL}${icon}@2x.png`

  const weatherStats = [
    {
      icon: "🌡️",
      label: "Feels like",
      value: `${feels_like}°C`,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      icon: "💧",
      label: "Humidity",
      value: `${humidity}%`,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: "💨",
      label: "Wind Speed",
      value: `${wind_speed} m/s`,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: "⏲️",
      label: "Pressure",
      value: `${pressure} hPa`,
      color: "from-purple-400 to-indigo-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Main Weather Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 dark:from-blue-600 dark:via-purple-700 dark:to-indigo-800 rounded-3xl shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl lg:text-6xl font-bold text-white mb-3"
              >
                {name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl lg:text-2xl text-white/90 capitalize font-medium"
              >
                {description}
              </motion.p>
            </div>

            <div className="flex items-center space-x-8">
              <motion.img
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 200 }}
                className="h-32 w-32 lg:h-40 lg:w-40 drop-shadow-2xl"
                src={iconUrl}
                alt="Weather icon"
              />
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 150 }}
                  className="text-7xl lg:text-8xl font-bold text-white mb-2"
                >
                  {temp}°
                </motion.div>
                <div className="flex space-x-6 text-white/80 text-lg">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    H: {temp_max}°
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    L: {temp_min}°
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {weatherStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`${stat.bgColor} backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="text-3xl group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherCard
