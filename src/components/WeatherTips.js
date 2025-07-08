import { useState, useEffect } from "react";
import { defaultTips } from "../utils/tips";

const WeatherTips = ({ weatherType }) => {
  const [tips, setTips] = useState(defaultTips);
  const [customTip, setCustomTip] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("custom_tips");
    if (saved) setTips(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const updated = { ...tips, [weatherType]: customTip };
    setTips(updated);
    localStorage.setItem("custom_tips", JSON.stringify(updated));
    setShowEditor(false);

    // fetch("http://localhost:8080/api/tips", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ condition: weatherType, tip: customTip }),
    // });
  };

  return (
    <div className="p-4 mt-4 bg-blue-50 rounded shadow text-blue-900">
      <h3 className="text-lg font-semibold">💡 Tip for {weatherType}:</h3>
      <p>{tips[weatherType] || "No tip available for this weather."}</p>
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => setShowEditor(true)}
      >
        ✏️ Edit Tip
      </button>

      {showEditor && (
        <div className="mt-3">
          <textarea
            className="w-full p-2 border rounded"
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Enter custom tip"
          />
          <button
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherTips;
