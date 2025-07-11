"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const defaultPrefs = {
  rain: false,
  tempBelow10: false,
  humidityAbove80: false,
  tempAbove30: false,
  aqiAbove100: false,
  severeWeather: false,
  email: "",
  city: "",
}

const AlertSettings = ({ onClose }) => {
  const [prefs, setPrefs] = useState(defaultPrefs)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("alertPrefs") || "{}")
    if (savedPrefs && Object.keys(savedPrefs).length > 0) {
      setPrefs({ ...defaultPrefs, ...savedPrefs })
    }
  }, [])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setPrefs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    localStorage.setItem("alertPrefs", JSON.stringify(prefs))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const alertOptions = [
    { key: "rain", label: "Rain Alert", icon: "🌧️", description: "Get notified when rain is expected" },
    {
      key: "tempBelow10",
      label: "Cold Weather",
      icon: "🥶",
      description: "Alert when temperature drops below 10°C",
    },
    {
      key: "tempAbove30",
      label: "Hot Weather",
      icon: "🔥",
      description: "Alert when temperature rises above 30°C",
    },
    {
      key: "humidityAbove80",
      label: "High Humidity",
      icon: "💧",
      description: "Alert when humidity exceeds 80%",
    },
    {
      key: "aqiAbove100",
      label: "Poor Air Quality",
      icon: "😷",
      description: "Alert when AQI is above 100",
    },
    {
      key: "severeWeather",
      label: "Severe Weather",
      icon: "⚠️",
      description: "Alert for storms and extreme conditions",
    },
  ]

  const Toggle = ({ enabled, onChange, label, description, icon }) => (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30 group"
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="p-2 sm:p-3 bg-blue-100/70 dark:bg-blue-900/40 rounded-xl group-hover:scale-105 transition-transform duration-300 ease-in-out">
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm sm:text-lg">{label}</h4>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">{description}</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`relative w-12 sm:w-16 h-6 sm:h-8 rounded-full transition-all duration-500 ease-in-out ${
          enabled
            ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
            : "bg-blue-200/70 dark:bg-blue-800/70"
        }`}
      >
        <motion.div
          animate={{ x: enabled ? (window.innerWidth > 640 ? 32 : 24) : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 sm:w-6 h-4 sm:h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          {enabled && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="h-2 sm:h-3 w-2 sm:w-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </motion.button>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, ease: "easeOut" }}
        className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6 sm:p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4, ease: "easeInOut" }}
                className="p-2 sm:p-3 bg-white/20 rounded-2xl"
              >
                <span className="text-2xl sm:text-3xl">🔔</span>
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Alert Settings</h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">Configure your weather notifications</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 sm:p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 ease-in-out"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">📧</span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={prefs.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/40 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-500 ease-in-out text-blue-900 dark:text-blue-100 text-base sm:text-lg placeholder-blue-600/60 dark:placeholder-blue-400/60"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-blue-800 dark:text-blue-200 mb-3">City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-blue-500 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={prefs.city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/40 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-500 ease-in-out text-blue-900 dark:text-blue-100 text-base sm:text-lg placeholder-blue-600/60 dark:placeholder-blue-400/60"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Alert Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">🔔</span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">Alert Preferences</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {alertOptions.map((option, index) => (
                <motion.div
                  key={option.key}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                >
                  <Toggle
                    enabled={prefs[option.key]}
                    onChange={(value) => setPrefs((prev) => ({ ...prev, [option.key]: value }))}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          >
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSave}
              disabled={saving || !prefs.email || !prefs.city}
              className="w-full p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 ease-in-out disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Saving Settings...</span>
                </>
              ) : saved ? (
                <>
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span>Save Alert Settings</span>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
            className="p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl sm:text-2xl">💡</span>
              <div>
                <h3 className="font-bold text-blue-900 dark:text-blue-100 text-base sm:text-lg mb-2">How it works</h3>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-sm sm:text-base">
                  You'll receive email notifications based on your selected preferences for the specified city. Make
                  sure to provide a valid email address and ensure the city name is correct for accurate alerts.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AlertSettings
