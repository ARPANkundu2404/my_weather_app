import { useEffect, useState } from "react";
import axios from "axios";

const defaultPrefs = {
  rain: false,
  tempBelow10: false,
  humidityAbove80: false,
  tempAbove30: false,
  aqiAbove100: false,
  severeWeather: false,
  email: "",
  city: "",
};

const AlertSettings = ({ onSave }) => {
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("alertPrefs"));
    if (savedPrefs) {
      setPrefs(savedPrefs);
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPrefs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem("alertPrefs", JSON.stringify(prefs));

    axios
      .post("http://localhost:8080/api/alerts", {
        userEmail: prefs.email,
        city: prefs.city,
        alertRain: prefs.rain,
        alertTempBelow10: prefs.tempBelow10,
        alertHumidityAbove80: prefs.humidityAbove80,
        alertTempAbove30: prefs.tempAbove30,
        alertAqiAbove100: prefs.aqiAbove100,
        alertSevereWeather: prefs.severeWeather,
      })
      .then(() => {
        alert("Preferences saved successfully!");
      })
      .catch((error) => {
        alert("Failed to save preferences");
        console.error(error);
      });
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Alert Settings</h2>
      <form>
        {Object.keys(defaultPrefs).map((key) => (
          <div key={key} className="mb-3">
            <label className="flex items-center">
              <input
                type={
                  typeof defaultPrefs[key] === "boolean" ? "checkbox" : "text"
                }
                name={key}
                checked={
                  typeof defaultPrefs[key] === "boolean"
                    ? prefs[key]
                    : undefined
                }
                value={typeof defaultPrefs[key] === "string" ? prefs[key] : ""}
                onChange={handleChange}
                className="mr-2"
              />
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default AlertSettings;
