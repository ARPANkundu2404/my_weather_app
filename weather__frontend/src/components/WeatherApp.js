"use client"

import SearchBox from "./SerachBox"
import WeatherCard from "./WeatherCard"
import { useState, useEffect } from "react"
import ForecastCard from "./ForecastCard"
import { motion, AnimatePresence } from "framer-motion"
import TrendChart from "./TrendChart"
import AQICard from "./AQICard"
import AlertSettings from "./AlertSettings"
import WeatherTips from "./WeatherTips"
import HistoryChart from "./HistoricalChart"
import SettingsPage from "./SettingPage"
import { useTranslation } from "react-i18next"
import WeatherMaps from "./WeatherMap"

const WeatherApp = () => {
  const { t } = useTranslation()
  const [weatherInfo, setWeatherInfo] = useState({})
  const [forecastInfo, setForecastInfo] = useState([])
  const [aqiInfo, setAqiInfo] = useState(null)
  const [activeTab, setActiveTab] = useState("current")
  const [alertSettings, setAlertSettings] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Remove this line:
  // const bgFile = WEATHER_BG_MAP[weatherInfo?.main] || DEFAULT_BG

  useEffect(() => {
    const dark = localStorage.getItem("darkMode") === "true"
    const large = localStorage.getItem("largeText") === "true"
    const root = document.documentElement
    if (dark) root.classList.add("dark")
    if (large) root.classList.add("large-text")
  }, [])

  const tabs = [
    {
      id: "current",
      label: t("current") || "Current",
      icon: "🌤️",
      desc: t("live_weather") || "Live weather data",
    },
    {
      id: "forecast",
      label: t("forecast") || "Forecast",
      icon: "📊",
      desc: t("hourly_predictions") || "Hourly predictions",
    },
    {
      id: "maps",
      label: "Maps",
      icon: "🗺️",
      desc: "Interactive radar",
    },
    {
      id: "history",
      label: t("history") || "History",
      icon: "📈",
      desc: t("historical_trends") || "Historical trends",
    },
  ]

  const TabButton = ({ tab, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-500 ease-in-out flex flex-col items-center justify-center space-y-1 min-w-[90px] sm:min-w-[120px] ${
        isActive
          ? "bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-700/90 dark:via-gray-600/80 dark:to-blue-800/70 text-blue-900 dark:text-blue-100 shadow-xl backdrop-blur-xl border border-blue-300/50 dark:border-blue-600/30"
          : "bg-gradient-to-br from-white/60 via-blue-50/40 to-blue-100/30 dark:from-gray-800/60 dark:via-gray-700/40 dark:to-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-gradient-to-br hover:from-white/80 hover:via-blue-50/60 hover:to-blue-100/50 dark:hover:from-gray-700/80 dark:hover:via-gray-600/60 dark:hover:to-blue-800/50 hover:shadow-lg backdrop-blur-md border border-blue-200/30 dark:border-blue-700/20"
      }`}
    >
      <motion.span
        animate={{ rotate: isActive ? [0, 3, -3, 0] : 0 }}
        transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatDelay: 4, ease: "easeInOut" }}
        className="text-lg sm:text-2xl"
      >
        {tab.icon}
      </motion.span>
      <span className="text-xs sm:text-sm font-bold leading-tight">{tab.label}</span>
      <span className="text-[10px] sm:text-xs opacity-70 hidden sm:block leading-tight">{tab.desc}</span>
    </motion.button>
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Remove the dynamic background div and replace with clean overlay */}
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-100/20 via-white/10 to-blue-50/20 dark:from-gray-900/20 dark:via-gray-800/10 dark:to-gray-900/20 -z-10" />

      {/* Keep the floating particles but make them more subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-200/20 dark:bg-blue-400/10 rounded-full"
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * -50 - 10, 0],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Rest of the content remains the same */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <div className="flex-1 w-full sm:w-auto">
            {!showSettings && !alertSettings && (
              <SearchBox setWeatherInfo={setWeatherInfo} setForecastInfo={setForecastInfo} setAqiInfo={setAqiInfo} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 self-end sm:self-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAlertSettings(true)
                setShowSettings(false)
              }}
              className="p-3 sm:p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-800/80 dark:via-gray-700/60 dark:to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out border border-blue-200/50 dark:border-blue-700/30 group"
              title={t("alert_settings") || "Alert Settings"}
            >
              <motion.span
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5, ease: "easeInOut" }}
                className="text-xl sm:text-2xl block group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400"
              >
                🔔
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSettings(true)
                setAlertSettings(false)
              }}
              className="p-3 sm:p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-800/80 dark:via-gray-700/60 dark:to-blue-900/50 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out border border-blue-200/50 dark:border-blue-700/30 group"
              title={t("settings") || "Settings"}
            >
              <motion.span
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="text-xl sm:text-2xl block group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400"
              >
                ⚙️
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        {!showSettings && !alertSettings && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="flex space-x-2 p-3 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-800/80 dark:via-gray-700/60 dark:to-blue-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-200/50 dark:border-blue-700/30 overflow-x-auto">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setAlertSettings(false)
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {showSettings ? (
            <SettingsPage key="settings" onClose={() => setShowSettings(false)} />
          ) : alertSettings ? (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300, ease: "easeOut" }}
            >
              <AlertSettings onClose={() => setAlertSettings(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: -10 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30, ease: "easeOut" }}
              className="space-y-6 sm:space-y-8"
            >
              {activeTab === "current" && (
                <>
                  <WeatherCard Info={weatherInfo} />
                  <WeatherTips weatherType={weatherInfo?.main} />
                  <AQICard aqi={aqiInfo?.aqi} components={aqiInfo?.components} />
                </>
              )}

              {activeTab === "forecast" && (
                <>
                  <ForecastCard forecast={forecastInfo} />
                  <TrendChart forecast={forecastInfo} />
                </>
              )}

              {activeTab === "maps" && <WeatherMaps />}

              {activeTab === "history" && <HistoryChart />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WeatherApp
