import React, { useState } from "react";

const preferences = [
  "relaxation", "sleep", "energy", "focus", "stress relief", 
  "immunity", "digestion", "mood", "calm", "clarity"
];

const RecommendationPage = () => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [description, setDescription] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const togglePreference = (pref) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  };

  const fetchRecommendations = async () => {
    setError("");
    setRecommendations([]);
    
    try {
      // Mock API response
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: selectedPreferences, description })
      });
      
      if (!response.ok) throw new Error("Failed to load recommendations");
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError("Failed to load recommendations. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">Get Personalized Recommendations</h1>
      <p className="text-center text-gray-600">Select your preferences and describe what you're looking for.</p>
      
      <div className="flex flex-wrap gap-2 my-4">
        {preferences.map((pref) => (
          <button
            key={pref}
            className={`px-4 py-2 rounded-full text-sm border ${
              selectedPreferences.includes(pref) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => togglePreference(pref)}
          >
            {pref}
          </button>
        ))}
      </div>
      
      <textarea
        className="w-full p-2 border rounded mt-2"
        placeholder="Describe what you're looking for..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      <button
        className="w-full bg-blue-600 text-white py-2 mt-4 rounded"
        onClick={fetchRecommendations}
      >
        Get Recommendations
      </button>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      <div className="mt-4">
        {recommendations.length > 0 ? (
          <ul className="list-disc pl-6">
            {recommendations.map((rec, index) => (
              <li key={index} className="mt-2">{rec}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recommendations found. Try selecting different preferences.</p>
        )}
      </div>
      
      <footer className="text-center text-gray-500 text-sm mt-6">
        © 2025 BakedBot.ai - AI-Powered Recommendations<br />
        <span className="text-xs">This is a prototype for demonstration purposes only.</span>
      </footer>
    </div>
  );
};

export default RecommendationPage;
