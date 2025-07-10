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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-200/50 dark:border-yellow-800/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                className="p-3 bg-white/20 rounded-2xl"
              >
                <span className="text-3xl">💡</span>
              </motion.div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Weather Tip for {weatherType}</h3>
                <p className="text-yellow-100 mt-1">Helpful advice for current conditions</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEditor(true)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all duration-300 group"
              title="Edit tip"
            >
              <svg
                className="h-6 w-6 text-white group-hover:scale-110 transition-transform"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm"
              >
                <p className="text-gray-800 dark:text-white text-xl leading-relaxed font-medium">{currentTip}</p>
              </motion.div>
            ) : (
              <motion.div
                key="tip-editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Custom tip for {weatherType} weather:
                  </label>
                  <textarea
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    placeholder="Enter your custom weather tip..."
                    rows={4}
                    className="w-full px-4 py-4 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 dark:focus:border-yellow-400 transition-all duration-300 text-gray-800 dark:text-white resize-none text-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
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
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2"
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