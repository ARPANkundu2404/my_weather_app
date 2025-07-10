import { motion } from "framer-motion"
import { getAQILabel } from "../utils/aqiLabel"

const AQICard = ({ aqi, components }) => {
  if (!aqi) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center p-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30"
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
          className="text-6xl mb-4"
        >
          🌬️
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 text-center">
          No air quality data available
        </h3>
      </motion.div>
    )
  }

  const { label, color, textColor, emoji } = getAQILabel(aqi)
  const healthAlert = aqi >= 4

  const pollutants = [
    { name: "PM2.5", value: components?.pm2_5, unit: "µg/m³", icon: "🔴", color: "from-red-400 to-red-600" },
    { name: "PM10", value: components?.pm10, unit: "µg/m³", icon: "🟠", color: "from-orange-400 to-orange-600" },
    { name: "CO", value: components?.co, unit: "µg/m³", icon: "🟡", color: "from-yellow-400 to-yellow-600" },
    { name: "NO₂", value: components?.no2, unit: "µg/m³", icon: "🔵", color: "from-blue-400 to-blue-600" },
    { name: "O₃", value: components?.o3, unit: "µg/m³", icon: "🟢", color: "from-green-400 to-green-600" },
    { name: "SO₂", value: components?.so2, unit: "µg/m³", icon: "🟣", color: "from-purple-400 to-purple-600" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 p-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                <motion.span
                  className="mr-4 text-3xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                >
                  🌬️
                </motion.span>
                Air Quality Index
              </h3>
              <p className="text-teal-100 mt-2">Real-time air pollution monitoring</p>
            </div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="flex items-center space-x-3"
              >
                <span className="text-4xl">{emoji}</span>
                <div>
                  <div className="text-4xl font-bold text-white">{aqi}</div>
                  <div className="text-sm font-semibold text-teal-100">{label}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="p-6">
          {/* Health Alert */}
          {healthAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-2xl backdrop-blur-sm"
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <motion.div
                  className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {pollutant.icon}
                </motion.div>
                <div className="font-bold text-gray-800 dark:text-white text-sm mb-1">{pollutant.name}</div>
                <div className={`text-lg font-bold bg-gradient-to-r ${pollutant.color} bg-clip-text text-transparent`}>
                  {pollutant.value || "N/A"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{pollutant.unit}</div>
              </motion.div>
            ))}
          </div>

          {/* Status Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {aqi <= 2 ? (
                  <svg className="h-6 w-6 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <h4 className="font-bold text-gray-800 dark:text-white text-lg">Air Quality Status: {label}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
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