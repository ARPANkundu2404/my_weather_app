"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { WEATHER_ICON_URL } from "../utils/constant"
import { WEATHER_BG_MAP, DEFAULT_BG } from "../utils/weatherBgMap"

const WeatherCard = ({ Info }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode =
        document.documentElement.classList.contains("dark") || localStorage.getItem("darkMode") === "true"
      setIsDarkMode(darkMode)
    }

    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  if (!Info || Object.keys(Info).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
            🔍
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Ready to explore weather?
          </h2>
          <p className="text-blue-700 dark:text-blue-300 text-lg max-w-md mx-auto">
            Enter a city name above to discover current weather conditions and forecasts
          </p>
        </div>
      </motion.div>
    )
  }

  const { name, temp, temp_max, temp_min, feels_like, humidity, description, icon, wind_speed, pressure } = Info
  const iconUrl = `${WEATHER_ICON_URL}${icon}@2x.png`

  // Get weather background for light mode only
  const weatherBg = !isDarkMode && Info?.main ? WEATHER_BG_MAP[Info.main] || DEFAULT_BG : null

  const weatherStats = [
    {
      icon: "🌡️",
      label: "Feels like",
      value: `${feels_like}°C`,
    },
    {
      icon: "💧",
      label: "Humidity",
      value: `${humidity}%`,
    },
    {
      icon: "💨",
      label: "Wind Speed",
      value: `${wind_speed} m/s`,
    },
    {
      icon: "⏲️",
      label: "Pressure",
      value: `${pressure} hPa`,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Main Weather Card with Dynamic Background */}
      <motion.div
        whileHover={{ scale: weatherBg ? 1.01 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Weather Background - Light Mode Only */}
        {weatherBg && (
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${weatherBg})` }}
          />
        )}

        {/* Overlay for better text readability in light mode with weather background */}
        {weatherBg && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-900/70 backdrop-blur-[1px]" />
        )}

        {/* Solid background for dark mode or light mode without weather background */}
        <div
          className={`absolute inset-0 ${
            weatherBg
              ? ""
              : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900"
          }`}
        />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg"
              >
                {name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="text-lg sm:text-xl lg:text-2xl text-white/90 capitalize font-medium drop-shadow-md"
              >
                {description}
              </motion.p>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
              <motion.img
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8, type: "spring", ease: "easeOut" }}
                className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 drop-shadow-2xl"
                src={iconUrl}
                alt="Weather icon"
              />
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring", ease: "easeOut" }}
                  className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-2 drop-shadow-lg"
                >
                  {temp}°
                </motion.div>
                <div className="flex space-x-4 text-white/80 text-base sm:text-lg drop-shadow-md">
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                  >
                    H: {temp_max}°
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
                  >
                    L: {temp_min}°
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {weatherStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30 hover:shadow-xl transition-all duration-500 ease-in-out group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <motion.div
                className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300 ease-in-out"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {stat.icon}
              </motion.div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{stat.value}</div>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wide">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherCard
