"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import {
  WEATHER_API_URL,
  WEATHER_API_KEY,
  FORECAST_API_URL,
  CURRENT_LOCATION_API_URL,
  AQI_API_URL,
} from "../utils/constant"

const SearchBox = ({ setWeatherInfo, setForecastInfo, setAqiInfo }) => {
  const { t } = useTranslation()
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleOnChange = (event) => {
    const input = event.target.value
    setCity(input)
    setError("")

    const history = JSON.parse(localStorage.getItem("searchHistory")) || []
    const filtered = history.filter((c) => c.toLowerCase().startsWith(input.toLowerCase()))
    setSuggestions(filtered)
    setShowSuggestions(input.length > 0 && filtered.length > 0)
  }

  const handleFocus = () => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || []
    setSuggestions(history)
    setShowSuggestions(history.length > 0)
  }

  const handleSuggestionClick = (suggestedCity) => {
    setCity(suggestedCity)
    setShowSuggestions(false)
  }

  const clearSuggestions = () => {
    setShowSuggestions(false)
  }

  const saveToHistory = (city) => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || []
    const updatedHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5)
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory))
  }

  const fetchAQI = async (lat, lon) => {
    try {
      const response = await fetch(`${AQI_API_URL}lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`)
      const data = await response.json()
      if (data && data.list && data.list.length > 0) {
        const aqiData = data.list[0]
        setAqiInfo({
          aqi: aqiData.main.aqi,
          components: aqiData.components,
        })
      }
    } catch (err) {
      setError(t("aqi_error") || "Unable to fetch AQI data. Please try again later.")
      setAqiInfo(null)
    }
  }

  const fetchWeatherInfo = async () => {
    setError("")
    setLoading(true)

    try {
      const forecastRes = await fetch(`${FORECAST_API_URL}q=${city}&appid=${WEATHER_API_KEY}&units=metric`)
      const forecastData = await forecastRes.json()

      if (!forecastRes.ok || !forecastData.list || forecastData.list.length === 0) {
        setError(t("city_not_found") || "City not found. Please enter a valid city name")
        setForecastInfo([])
        setWeatherInfo({})
        return
      }

      const forecastList = forecastData.list.slice(0, 9).map((item) => ({
        time: item.dt_txt.split(" ")[1].slice(0, 5),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        desc: item.weather[0].description,
        icon: item.weather[0].icon,
      }))

      setForecastInfo(forecastList)

      const response = await fetch(`${WEATHER_API_URL}q=${city}&appid=${WEATHER_API_KEY}&units=metric`)

      if (!response.ok) {
        setError(t("city_not_found") || "City not found. Please enter a valid city name")
        setWeatherInfo({})
        return
      }

      const jsonResponse = await response.json()

      const Info = {
        name: jsonResponse.name,
        temp: Math.round(jsonResponse.main.temp),
        temp_max: Math.round(jsonResponse.main.temp_max),
        temp_min: Math.round(jsonResponse.main.temp_min),
        humidity: jsonResponse.main.humidity,
        feels_like: Math.round(jsonResponse.main.feels_like),
        icon: jsonResponse.weather[0].icon,
        description: jsonResponse.weather[0].description,
        main: jsonResponse.weather[0].main,
        wind_speed: jsonResponse.wind?.speed || 0,
        pressure: jsonResponse.main.pressure,
      }

      setWeatherInfo(Info)
      setError("")
      saveToHistory(city)
      localStorage.setItem("searchCity", city)

      if (jsonResponse.coord && jsonResponse.coord.lat && jsonResponse.coord.lon) {
        fetchAQI(jsonResponse.coord.lat, jsonResponse.coord.lon)
      } else {
        setError(t("aqi_error") || "Unable to fetch AQI data for the provided city.")
        setAqiInfo(null)
      }
    } catch (error) {
      setError(t("general_error") || "Something went wrong. Please try again later.")
      setWeatherInfo({})
      setForecastInfo([])
      setAqiInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCurrentLocationClick = () => {
    setError("")
    setLoading(true)

    if (!navigator.geolocation) {
      setError(t("geolocation_error") || "Geolocation is not supported by this browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const geoRes = await fetch(
            `${CURRENT_LOCATION_API_URL}lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`,
          )

          if (!geoRes.ok) {
            setError(t("location_error") || "Unable to fetch location data")
            setLoading(false)
            return
          }

          const geoData = await geoRes.json()
          if (geoData && geoData[0] && geoData[0].name) {
            setCity(geoData[0].name)
            setError("")
            fetchAQI(latitude, longitude)
          } else {
            setError(t("location_name_error") || "Unable to fetch city name from your location.")
            setAqiInfo(null)
          }
        } catch (error) {
          setError(t("location_general_error") || "Something went wrong with location. Please try again later.")
          setAqiInfo(null)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setError(t("location_access_error") || "Unable to access your location. Please enable location services.")
        setWeatherInfo({})
        setAqiInfo(null)
        setLoading(false)
      },
    )
  }

  const handleOnSubmit = (event) => {
    event.preventDefault()
    if (!city.trim()) {
      setError(t("enter_city") || "Please enter a city name.")
      setWeatherInfo({})
      setAqiInfo(null)
      return
    }
    fetchWeatherInfo()
    setCity("")
    setShowSuggestions(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-white/30 dark:border-gray-700/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 3, -3, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
            className="text-4xl sm:text-6xl mb-3 sm:mb-4"
          >
            🌤️
          </motion.div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent mb-2 leading-tight">
            {t("weather_dashboard") || "Weather Dashboard"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
            {t("discover_weather") || "Discover weather conditions worldwide"}
          </p>
        </motion.div>

        <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg bg-gray-50/90 dark:bg-gray-700/90 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                  type="text"
                  value={city}
                  name="city"
                  placeholder={t("enter_city_placeholder") || "Enter city name..."}
                  onChange={handleOnChange}
                  onFocus={handleFocus}
                  onBlur={() => setTimeout(clearSuggestions, 200)}
                />

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 rounded-xl sm:rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto"
                    >
                      {suggestions.map((suggestedCity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestedCity)}
                          className="flex items-center px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/60 transition-all duration-200 border-b border-gray-100/60 dark:border-gray-700/60 last:border-b-0 group"
                        >
                          <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2 sm:mr-3 group-hover:text-blue-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm sm:text-base text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {suggestedCity}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleCurrentLocationClick}
                disabled={loading}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex-shrink-0"
                title={t("use_location") || "Use my location"}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-105 transition-transform"
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
                )}
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-3 sm:p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full mr-2 sm:mr-3"
                />
                {t("searching") || "Searching..."}
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {t("search_weather") || "Search Weather"}
              </div>
            )}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                className="p-3 sm:p-4 bg-red-50/90 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/60 rounded-xl sm:rounded-2xl backdrop-blur-sm"
              >
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-700 dark:text-red-400 font-medium text-sm sm:text-base">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  )
}

export default SearchBox
