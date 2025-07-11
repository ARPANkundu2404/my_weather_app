"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { defaultTips } from "../utils/tips"

const WeatherTips = ({ weatherType }) => {
  const [tips, setTips] = useState(defaultTips)
  const [customTip, setCustomTip] = useState("")
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("custom_tips")
    if (saved) setTips(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (weatherType && tips[weatherType]) {
      setCustomTip(tips[weatherType])
    }
  }, [weatherType, tips])

  const handleSave = () => {
    if (!weatherType) return

    const updated = { ...tips, [weatherType]: customTip }
    setTips(updated)
    localStorage.setItem("custom_tips", JSON.stringify(updated))
    setShowEditor(false)
  }

  const handleCancel = () => {
    setCustomTip(tips[weatherType] || "")
    setShowEditor(false)
  }

  if (!weatherType) {
    return null
  }

  const currentTip = tips[weatherType] || "No tip available for this weather condition."

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
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4, ease: "easeInOut" }}
                className="p-3 bg-white/20 rounded-2xl"
              >
                <span className="text-3xl">💡</span>
              </motion.div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Weather Tip for {weatherType}</h3>
                <p className="text-blue-100 mt-1">Helpful advice for current conditions</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEditor(true)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 ease-in-out group"
              title="Edit tip"
            >
              <svg
                className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {!showEditor ? (
              <motion.div
                key="tip-display"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 bg-gradient-to-br from-white/70 via-blue-50/50 to-blue-100/40 dark:from-gray-700/70 dark:via-gray-600/50 dark:to-blue-800/40 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
              >
                <p className="text-blue-900 dark:text-blue-100 text-xl leading-relaxed font-medium">{currentTip}</p>
              </motion.div>
            ) : (
              <motion.div
                key="tip-editor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-bold text-blue-900 dark:text-blue-100 mb-3">
                    Custom tip for {weatherType} weather:
                  </label>
                  <textarea
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    placeholder="Enter your custom weather tip..."
                    rows={4}
                    className="w-full px-4 py-4 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/40 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-500 ease-in-out text-blue-900 dark:text-blue-100 resize-none text-lg placeholder-blue-600/60 dark:placeholder-blue-400/60"
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out flex items-center justify-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span>Save Tip</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-6 py-4 bg-gradient-to-br from-white/70 via-blue-50/50 to-blue-100/40 dark:from-gray-700/70 dark:via-gray-600/50 dark:to-blue-800/40 backdrop-blur-sm hover:from-white/80 hover:via-blue-50/60 hover:to-blue-100/50 dark:hover:from-gray-600/80 dark:hover:via-gray-500/60 dark:hover:to-blue-700/50 text-blue-900 dark:text-blue-100 rounded-2xl font-bold transition-all duration-500 ease-in-out flex items-center justify-center space-x-2 border border-blue-200/60 dark:border-blue-700/40"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default WeatherTips
