// File: frontend/src/pages/RecommendationPage.jsx
import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import PreferenceSelector from '../components/PreferenceSelector';
import SearchBar from '../components/SearchBar';
import { getPersonalizedRecommendations } from '../services/api';

const RecommendationPage = () => {
  const [preferences, setPreferences] = useState([]);
  const [userQuery, setUserQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const fetchRecommendations = async () => {
    if (preferences.length === 0) {
      setError('Please select at least one preference to get recommendations.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowIntro(false);
      
      const data = await getPersonalizedRecommendations(
        preferences,
        userQuery,
        8
      );
      
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setUserQuery(query);
    fetchRecommendations();
  };

  useEffect(() => {
    if (preferences.length > 0 && !showIntro) {
      fetchRecommendations();
    }
  }, [preferences]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Get Personalized Recommendations</h1>
        <p className="mb-6">Select your preferences and describe what you're looking for to get AI-powered personalized product recommendations.</p>
        
        <PreferenceSelector
          selectedPreferences={preferences}
          onChange={setPreferences}
        />
        
        <SearchBar onSearch={handleSearch} />
        
        <button
          onClick={fetchRecommendations}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-medium"
          disabled={loading || preferences.length === 0}
        >
          {loading ? 'Finding the perfect products...' : 'Get Recommendations'}
        </button>
        
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>

      {showIntro ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">How Our AI Recommendation System Works</h2>
          <div className="max-w-2xl mx-auto">
            <p className="mb-4">
              Our system uses advanced AI and Retrieval-Augmented Generation (RAG) to find products that match your preferences.
            </p>
            <p className="mb-4">
              1. Select your preferences from the options above<br />
              2. Optionally, describe what you're looking for<br />
              3. Our AI analyzes product ingredients and effects to find the best matches<br />
              4. RAG enhances the recommendations with detailed context and explanations
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-10">Generating personalized recommendations...</div>
      ) : recommendations.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Personalized Recommendations</h2>
          <ProductGrid products={recommendations} />
        </div>
      ) : (
        <div className="text-center py-10">
          No recommendations found. Try selecting different preferences.
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
