"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WEATHER_API_KEY, WEATHER_MAP_API_URL } from "../utils/constant";

const WeatherMaps = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState("precipitation");
  const [mapCenter, setMapCenter] = useState([40.7128, -74.006]); // Default to NYC
  const [zoom, setZoom] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const weatherLayers = [
    {
      id: "precipitation",
      name: "Precipitation",
      icon: "🌧️",
      description: "Rainfall and snow intensity",
      layer: "precipitation_new",
    },
    {
      id: "temperature",
      name: "Temperature",
      icon: "🌡️",
      description: "Temperature distribution",
      layer: "temp_new",
    },
    {
      id: "wind",
      name: "Wind Speed",
      icon: "💨",
      description: "Wind speed patterns",
      layer: "wind_new",
    },
    {
      id: "clouds",
      name: "Cloud Cover",
      icon: "☁️",
      description: "Cloud coverage",
      layer: "clouds_new",
    },
    {
      id: "pressure",
      name: "Pressure",
      icon: "📊",
      description: "Atmospheric pressure",
      layer: "pressure_new",
    },
  ];

  useEffect(() => {
    // Check if searched city exists and get its coordinates
    const searchedCity = localStorage.getItem("searchCity");
    if (searchedCity) {
      fetchCityCoordinates(searchedCity);
    } else {
      // Try to get user's current location
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      initializeMap();
    }
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapCenter]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateWeatherLayer();
    }
  }, [selectedLayer]);

  const fetchCityCoordinates = async (cityName) => {
    try {
      const response = await fetch(
        `${WEATHER_MAP_API_URL}${cityName}&limit=1&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setMapCenter([data[0].lat, data[0].lon]);
        setZoom(10);
      }
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(8);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Keep default location
        }
      );
    }
  };

  const initializeMap = async () => {
  if (!mapRef.current) return;

  try {
    const L = await import("leaflet");

    // 🧹 Fix: If map already exists, remove it from DOM and internal cache
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // 🧼 Also clear any leftover _leaflet_id from DOM
    if (mapRef.current._leaflet_id) {
      delete mapRef.current._leaflet_id;
    }

    const map = L.map(mapRef.current, {
      center: mapCenter,
      zoom: zoom,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const customIcon = L.divIcon({
      html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker(mapCenter, { icon: customIcon }).addTo(map);

    mapInstanceRef.current = map;
    setLoading(false);

    updateWeatherLayer();
  } catch (error) {
    console.error("Error initializing map:", error);
    setError("Failed to load map. Please try again.");
    setLoading(false);
  }
};
;

  const updateWeatherLayer = async () => {
    if (!mapInstanceRef.current) return;

    try {
      const L = await import("leaflet");

      // Remove existing weather layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer.options && layer.options.isWeatherLayer) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new weather layer
      const selectedWeatherLayer = weatherLayers.find(
        (layer) => layer.id === selectedLayer
      );
      if (selectedWeatherLayer) {
        const weatherTileLayer = L.tileLayer(
          `https://tile.openweathermap.org/map/${selectedWeatherLayer.layer}/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`,
          {
            attribution: "© OpenWeatherMap",
            opacity: 0.7,
            maxZoom: 18,
            isWeatherLayer: true,
          }
        );

        weatherTileLayer.addTo(mapInstanceRef.current);
      }
    } catch (error) {
      console.error("Error updating weather layer:", error);
    }
  };

  const LayerButton = ({ layer, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(layer.id)}
      className={`relative px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-500 ease-in-out flex items-center space-x-2 text-xs sm:text-sm min-w-[100px] sm:min-w-[120px] ${
        isActive
          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
          : "bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 text-blue-900 dark:text-blue-100 hover:from-white/90 hover:via-blue-50/70 hover:to-blue-100/60 dark:hover:from-gray-600/90 dark:hover:via-gray-500/70 dark:hover:to-blue-700/60 border border-blue-200/50 dark:border-blue-700/30"
      }`}
    >
      <span className="text-base sm:text-lg">{layer.icon}</span>
      <div className="text-left">
        <div className="font-bold leading-tight">{layer.name}</div>
        <div className="text-xs opacity-80 leading-tight hidden sm:block">
          {layer.description}
        </div>
      </div>
    </motion.button>
  );

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto p-8 sm:p-12 bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-red-900/20 dark:via-gray-800 dark:to-red-900/20 backdrop-blur-xl rounded-3xl border border-red-200/50 dark:border-red-800/30 shadow-2xl"
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
            className="text-6xl sm:text-8xl mb-6 text-red-500 dark:text-red-400"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-100 mb-4">
            Map Loading Error
          </h2>
          <p className="text-red-700 dark:text-red-300 text-lg">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 dark:border-blue-700/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
                className="p-2 sm:p-3 bg-white/20 rounded-2xl"
              >
                <span className="text-2xl sm:text-3xl">🗺️</span>
              </motion.div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Interactive Weather Maps
                </h3>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  Real-time weather visualization and radar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="p-4 sm:p-6 border-b border-blue-200/30 dark:border-blue-700/20">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <span className="text-lg sm:text-xl">🔧</span>
            <h4 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
              Weather Layers
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {weatherLayers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <LayerButton
                  layer={layer}
                  isActive={selectedLayer === layer.id}
                  onClick={setSelectedLayer}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/60 to-blue-100/50 dark:from-gray-800/80 dark:via-gray-700/60 dark:to-blue-900/50 backdrop-blur-sm z-10 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
                  />
                  <p className="text-blue-900 dark:text-blue-100 font-semibold text-base sm:text-lg">
                    Loading interactive map...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div
              ref={mapRef}
              className="w-full h-96 sm:h-[500px] lg:h-[600px] rounded-b-3xl overflow-hidden"
              style={{ minHeight: "400px" }}
            />

            {/* Map Controls Overlay */}
            <div className="absolute top-4 left-4 bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30 p-3">
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getCurrentLocation}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 ease-in-out"
                  title="Center on my location"
                >
                  <svg
                    className="h-4 w-4"
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
                </motion.button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-gradient-to-br from-white/90 via-blue-50/80 to-blue-100/70 dark:from-gray-800/90 dark:via-gray-700/80 dark:to-blue-900/70 backdrop-blur-xl rounded-2xl shadow-lg border border-blue-200/50 dark:border-blue-700/30 p-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {
                    weatherLayers.find((layer) => layer.id === selectedLayer)
                      ?.icon
                  }
                </span>
                <div>
                  <div className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                    {
                      weatherLayers.find((layer) => layer.id === selectedLayer)
                        ?.name
                    }
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {
                      weatherLayers.find((layer) => layer.id === selectedLayer)
                        ?.description
                    }
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Info */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                Interactive
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Pan & Zoom
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                Real-time
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Live Data
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
              className="text-center p-4 bg-gradient-to-br from-white/80 via-blue-50/60 to-blue-100/50 dark:from-gray-700/80 dark:via-gray-600/60 dark:to-blue-800/50 backdrop-blur-sm rounded-2xl border border-blue-200/40 dark:border-blue-700/20"
            >
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                Multiple
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Weather Layers
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherMaps;
