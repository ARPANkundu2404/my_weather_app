"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const SettingsPage = ({ onClose }) => {
  const { t, i18n } = useTranslation()

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true")
  const [largeText, setLargeText] = useState(() => localStorage.getItem("largeText") === "true")
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem("lang") || "en")

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) root.classList.add("dark")
    else root.classList.remove("dark")
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  useEffect(() => {
    const root = document.documentElement
    if (largeText) root.classList.add("large-text")
    else root.classList.remove("large-text")
    localStorage.setItem("largeText", largeText.toString())
  }, [largeText])

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleLanguageChange = async (lang) => {
    try {
      if (i18n && i18n.changeLanguage) {
        await i18n.changeLanguage(lang)
        localStorage.setItem("lang", lang)
        setCurrentLang(lang)
      } else {
        localStorage.setItem("lang", lang)
        setCurrentLang(lang)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error changing language:", error)
      localStorage.setItem("lang", lang)
      setCurrentLang(lang)
      window.location.reload()
    }
  }

  const Toggle = ({ enabled, onChange, icon, label, description }) => (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30 group"
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="p-2 sm:p-3 bg-blue-100/70 dark:bg-blue-900/40 rounded-xl group-hover:scale-105 transition-transform duration-300 ease-in-out">
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm sm:text-lg leading-tight">{label}</h3>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1 leading-tight">{description}</p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`relative w-12 sm:w-16 h-6 sm:h-8 rounded-full transition-all duration-500 ease-in-out flex-shrink-0 ${
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
                <span className="text-2xl sm:text-3xl">⚙️</span>
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {t("settings") || "Settings"}
                </h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  {t("customize_experience") || "Customize your weather experience"}
                </p>
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
          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">🎨</span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                {t("appearance") || "Appearance"}
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <Toggle
                enabled={darkMode}
                onChange={setDarkMode}
                icon={darkMode ? "🌙" : "☀️"}
                label={t("dark_mode") || "Dark Mode"}
                description={t("dark_mode_desc") || "Switch between light and dark themes for comfortable viewing"}
              />
              <Toggle
                enabled={largeText}
                onChange={setLargeText}
                icon="🔤"
                label={t("large_text") || "Large Text"}
                description={t("large_text_desc") || "Increase text size for better readability and accessibility"}
              />
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">🌍</span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                {t("language") || "Language"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { code: "en", name: "English", flag: "🇺🇸", desc: "English (United States)" },
                { code: "hi", name: "हिन्दी", flag: "🇮🇳", desc: "Hindi (भारत)" },
              ].map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-500 ease-in-out ${
                    currentLang === lang.code
                      ? "border-blue-500/60 bg-gradient-to-br from-blue-50/80 via-blue-100/60 to-blue-200/50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-700/10 shadow-lg shadow-blue-500/20"
                      : "border-blue-200/60 dark:border-blue-700/40 bg-gradient-to-br from-white/70 via-blue-50/50 to-blue-100/40 dark:from-gray-700/70 dark:via-gray-600/50 dark:to-blue-800/40 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-2xl sm:text-3xl">{lang.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-bold text-blue-900 dark:text-blue-100 text-sm sm:text-lg leading-tight">
                        {lang.name}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-tight">
                        {lang.desc}
                      </div>
                    </div>
                    {currentLang === lang.code && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <svg
                          className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Accessibility Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl">♿</span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                {t("accessibility") || "Accessibility"}
              </h2>
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-4 sm:p-6 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100/70 dark:bg-blue-900/40 rounded-xl">
                    <span className="text-xl sm:text-2xl">🔊</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm sm:text-lg leading-tight">
                      {t("voice_assist") || "Voice Assistant"}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1 leading-tight">
                      {t("voice_assist_desc") || "Test text-to-speech functionality for accessibility"}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    speak(
                      t("voice_demo") ||
                        "This is your Weather App speaking. All systems are working perfectly! You can use voice assistance for better accessibility.",
                    )
                  }
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center space-x-2"
                >
                  <span className="text-base sm:text-lg">🔊</span>
                  <span className="text-sm sm:text-base">{t("test_voice") || "Test Voice"}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="p-6 sm:p-8 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700/30"
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, ease: "easeInOut" }}
                className="text-2xl sm:text-3xl"
              >
                ℹ️
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2 sm:mb-3">
                  {t("about_app") || "About Weather Dashboard"}
                </h2>
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed text-sm sm:text-lg">
                  {t("about_desc") ||
                    "A modern, accessible weather application providing real-time weather data, forecasts, air quality monitoring, and multilingual support. Built with React, Tailwind CSS, and Framer Motion for the best user experience across all devices."}
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                  {["React", "Tailwind CSS", "Framer Motion", "Chart.js", "OpenWeatherMap API"].map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      className="px-2 sm:px-3 py-1 bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPage
