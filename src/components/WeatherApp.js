"use client"

import SearchBox from "./SerachBox"
import WeatherCard from "./WeatherCard"
import { useState, useEffect } from "react"
import ForecastCard from "./ForecastCard"
import { motion, AnimatePresence } from "framer-motion"
import TrendChart from "./TrendChart"
import AQICard from "./AQICard"
import { WEATHER_BG_MAP, DEFAULT_BG } from "../utils/weatherBgMap"
import AlertSettings from "./AlertSettings"
import WeatherTips from "./WeatherTips"
import HistoryChart from "./HistoricalChart"
import SettingsPage from "./SettingPage"
import { useTranslation } from "react-i18next"

const WeatherApp = () => {
  const { t, i18n } = useTranslation()
  const [weatherInfo, setWeatherInfo] = useState({})
  const [forecastInfo, setForecastInfo] = useState([])
  const [aqiInfo, setAqiInfo] = useState(null)
  const [activeTab, setActiveTab] = useState("current")
  const [alertSettings, setAlertSettings] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const bgFile = WEATHER_BG_MAP[weatherInfo?.main] || DEFAULT_BG

  useEffect(() => {
    const dark = localStorage.getItem("darkMode") === "true"
    const large = localStorage.getItem("largeText") === "true"
    const savedLang = localStorage.getItem("lang") || "en"

    const root = document.documentElement
    if (dark) root.classList.add("dark")
    if (large) root.classList.add("large-text")

    // Set language if i18n is available
    if (i18n && i18n.changeLanguage && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang).catch(console.error)
    }
  }, [i18n])

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
      className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center justify-center space-y-1 min-w-[90px] sm:min-w-[120px] ${
        isActive
          ? "bg-white/95 dark:bg-gray-800/95 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/20 backdrop-blur-xl"
          : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-lg backdrop-blur-md"
      }`}
    >
      <motion.span
        animate={{ rotate: isActive ? [0, 5, -5, 0] : 0 }}
        transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatDelay: 3 }}
        className="text-lg sm:text-2xl"
      >
        {tab.icon}
      </motion.span>
      <span className="text-xs sm:text-sm font-bold leading-tight">{tab.label}</span>
      <span className="text-[10px] sm:text-xs opacity-70 hidden sm:block leading-tight">{tab.desc}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white/95 dark:bg-gray-800/95 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl -z-10"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )

  return (
    <div className="min-h-screen relative overflow-hidden font-inter">
      {/* Enhanced Background with better mobile optimization */}
      <motion.div
        key={bgFile}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20"
        style={{ backgroundImage: `url(${bgFile})` }}
      />

      {/* Refined overlay system */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 -z-10" />
      <div className="fixed inset-0 backdrop-blur-[0.5px] bg-white/5 dark:bg-black/10 -z-10" />

      {/* Floating particles with mobile optimization */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(typeof window !== "undefined" && window.innerWidth > 768 ? 12 : 6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 150 - 75, 0],
              y: [0, Math.random() * -150 - 25, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen p-3 sm:p-4 lg:p-6">
        {/* Enhanced Header with better mobile layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 sm:mb-8">
          <div className="flex-1 w-full sm:w-auto">
            {!showSettings && !alertSettings && (
              <SearchBox setWeatherInfo={setWeatherInfo} setForecastInfo={setForecastInfo} setAqiInfo={setAqiInfo} />
            )}
          </div>

          {/* Refined Action Buttons */}
          <div className="flex space-x-2 sm:space-x-3 self-end sm:self-start">
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAlertSettings(true)
                setShowSettings(false)
              }}
              className="p-3 sm:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-gray-700/30 group"
              title={t("alert_settings") || "Alert Settings"}
            >
              <motion.span
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
                className="text-xl sm:text-2xl block group-hover:scale-110 transition-transform"
              >
                🔔
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSettings(true)
                setAlertSettings(false)
              }}
              className="p-3 sm:p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 dark:border-gray-700/30 group"
              title={t("settings") || "Settings"}
            >
              <motion.span
                animate={{ rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
                transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="text-xl sm:text-2xl block group-hover:scale-110 transition-transform"
              >
                ⚙️
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Tab Navigation with mobile optimization */}
        {!showSettings && !alertSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="flex space-x-1 sm:space-x-2 p-2 sm:p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/30 dark:border-gray-700/30 overflow-x-auto">
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

        {/* Enhanced Content with better transitions */}
        <AnimatePresence mode="wait">
          {showSettings ? (
            <SettingsPage key="settings" onClose={() => setShowSettings(false)} />
          ) : alertSettings ? (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            >
              <AlertSettings onClose={() => setAlertSettings(false)} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -30, y: -10 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
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

              {activeTab === "history" && <HistoryChart />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WeatherApp