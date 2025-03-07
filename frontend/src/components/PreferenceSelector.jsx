// File: frontend/src/components/PreferenceSelector.jsx
import React from 'react';

const AVAILABLE_PREFERENCES = [
  'relaxation', 
  'sleep', 
  'energy', 
  'focus', 
  'stress relief', 
  'immunity', 
  'digestion', 
  'mood',
  'calm',
  'clarity'
];

const PreferenceSelector = ({ selectedPreferences, onChange }) => {
  const togglePreference = (preference) => {
    if (selectedPreferences.includes(preference)) {
      onChange(selectedPreferences.filter(p => p !== preference));
    } else {
      onChange([...selectedPreferences, preference]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Your Preferences</h3>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_PREFERENCES.map(preference => (
          <button
            key={preference}
            className={`px-3 py-2 rounded-full text-sm ${
              selectedPreferences.includes(preference)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => togglePreference(preference)}
          >
            {preference}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreferenceSelector;
