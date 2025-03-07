const products = require('../data/products.json');
const ingredients = require('../data/ingredients.json');
const { enhanceRecommendationsWithRAG } = require('../rag/ragService');

// Simple recommendation algorithm based on popularity (sales data)
const getRecommendations = async (count = 4) => {
  // Sort products by units sold (popularity)
  const sortedProducts = [...products].sort((a, b) => 
    b.sales_data.units_sold - a.sales_data.units_sold
  );
  
  // Take the top 'count' products
  return sortedProducts.slice(0, count);
};

// More advanced recommendation based on user preferences
const getPersonalizedRecommendations = async (preferences, userQuery, count = 4) => {
  // Calculate a score for each product based on how well it matches preferences
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Score based on matching effects
    preferences.forEach(pref => {
      if (product.effects.includes(pref)) {
        score += 3;  // Higher weight for direct effect matches
      }
      
      // Check if ingredients in the product have the desired effects
      product.ingredients.forEach(ingName => {
        const ingredient = ingredients.find(ing => ing.name === ingName);
        if (ingredient && ingredient.common_effects.includes(pref)) {
          score += 2;  // Additional points for ingredient effect matches
        }
      });
    });
    
    // Boost score slightly based on popularity
    score += (product.sales_data.units_sold / 100);
    
    return { ...product, score };
  });
  
  // Sort by score (highest first)
  const sortedProducts = scoredProducts.sort((a, b) => b.score - a.score);
  
  // Take the top matches
  const topRecommendations = sortedProducts.slice(0, count);
  
  // Enhance recommendations using RAG based on user query
  if (userQuery) {
    return await enhanceRecommendationsWithRAG(topRecommendations, userQuery, preferences);
  }
  
  return topRecommendations;
};

module.exports = {
  getRecommendations,
  getPersonalizedRecommendations
};
