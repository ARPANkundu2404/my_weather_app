import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t, i18n } = useTranslation();

  // Accessibility states
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("darkMode") === "true"
  );
  const [largeText, setLargeText] = useState(() =>
    localStorage.getItem("largeText") === "true"
  );

  // Save to localStorage when changed
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("largeText", largeText);
  }, [largeText]);

  // Voice Assist
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`min-h-screen p-6 transition ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } ${largeText ? "text-xl" : "text-base"}`}
    >
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">{t("settings") || "⚙️ Settings"}</h1>

        {/* Language toggle */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">{t("language") || "Language"}</label>
          <div className="flex gap-4">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              English
            </button>
            <button
              onClick={() => i18n.changeLanguage("hi")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">{t("dark_mode") || "Dark Mode"}</label>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {darkMode ? t("disable") || "Disable" : t("enable") || "Enable"}
          </button>
        </div>

        {/* Large Text */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">{t("large_text") || "Large Text"}</label>
          <button
            onClick={() => setLargeText(!largeText)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {largeText ? t("disable") || "Disable" : t("enable") || "Enable"}
          </button>
        </div>

        {/* Voice Assist */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">{t("voice_assist") || "Voice Assist"}</label>
          <button
            onClick={() => speak(t("voice_demo") || "This is your Weather App speaking.")}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            🔊 {t("speak") || "Speak"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;