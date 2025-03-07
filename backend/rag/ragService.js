// File: backend/rag/ragService.js
const { searchVectorStore } = require('./vectorStore');
const products = require('../data/products.json');
const ingredients = require('../data/ingredients.json');

// Generate enhanced product details using RAG
const getProductDetailWithRAG = async (product) => {
  try {
    // Create a copy of the product to avoid modifying the original
    const enhancedProduct = { ...product };
    
    // Get information about the ingredients from the knowledge base
    const ingredientDetails = [];
    for (const ingredientName of product.ingredients) {
      // First try to find the ingredient in our structured data
      const structuredIngredient = ingredients.find(i => i.name === ingredientName);
      
      if (structuredIngredient) {
        ingredientDetails.push(structuredIngredient);
      } else {
        // If not found in structured data, search the vector store
        const searchResults = await searchVectorStore(ingredientName, 'ingredients', 1);
        if (searchResults.length > 0) {
          ingredientDetails.push(searchResults[0].ingredient);
        }
      }
    }
    
    // Find similar products
    const productQuery = `${product.type} ${product.effects.join(' ')}`;
    const similarProducts = await searchVectorStore(productQuery, 'products', 3);
    
    // Filter out the current product from similar products
    const filteredSimilarProducts = similarProducts
      .filter(item => item.product.id !== product.id)
      .map(item => item.product);
    
    // Add RAG-enhanced information to the product
    enhancedProduct.ingredientDetails = ingredientDetails;
    enhancedProduct.similarProducts = filteredSimilarProducts;
    
    // Generate additional insights based on the data we have
    enhancedProduct.insightsFromRAG = generateInsights(product, ingredientDetails);
    
    return enhancedProduct;
  } catch (error) {
    console.error('Error in RAG product enhancement:', error);
    // Return original product if there's an error
    return product;
  }
};

// Enhance recommendations with contextual information using RAG
const enhanceRecommendationsWithRAG = async (recommendations, userQuery, preferences) => {
  try {
    // Search for relevant information based on user query
    const queryResults = await searchVectorStore(userQuery, 'products', 10);
    const ingredientResults = await searchVectorStore(userQuery, 'ingredients', 5);
    
    // Create a map of current recommendation IDs for quick lookup
    const recommendedIds = new Set(recommendations.map(rec => rec.id));
    
    // Check if there are highly relevant products from the query that aren't already recommended
    const additionalRecommendations = queryResults
      .filter(result => !recommendedIds.has(result.product.id))
      .slice(0, 2)
      .map(result => ({
        ...result.product,
        score: result.similarity * 100, // Normalize similarity score
        ragReason: `Added based on your query: "${userQuery}"`
      }));
    
    // Enhance existing recommendations with reasoning from RAG
    const enhancedRecommendations = recommendations.map(rec => {
      // Find relevant ingredients that match user preferences
      const relevantIngredients = rec.ingredients
        .map(ingName => ingredients.find(i => i.name === ingName))
        .filter(ing => ing && ing.common_effects.some(effect => preferences.includes(effect)));
      
      // Create explanation based on ingredients and effects
      let ragReason = '';
      if (relevantIngredients.length > 0) {
        const effectsList = relevantIngredients
          .flatMap(ing => ing.common_effects)
          .filter(effect => preferences.includes(effect))
          .filter((effect, index, self) => self.indexOf(effect) === index) // Unique effects
          .join(', ');
        
        ragReason = `Recommended because it contains ${relevantIngredients.map(i => i.name).join(', ')}, which provide effects you're looking for: ${effectsList}.`;
      } else {
        ragReason = `Recommended based on your preferences for ${preferences.join(', ')}.`;
      }
      
      return {
        ...rec,
        ragReason
      };
    });
    
    // Combine enhanced recommendations with additional ones
    // but keep the original recommendations first
    return [...enhancedRecommendations, ...additionalRecommendations];
  } catch (error) {
    console.error('Error enhancing recommendations with RAG:', error);
    // Return original recommendations if there's an error
    return recommendations;
  }
};

// Generate insights about a product based on its ingredients and data
const generateInsights = (product, ingredientDetails) => {
  const insights = [];
  
  // Check if all ingredients have scientific evidence
  const scientificallyBackedIngredients = ingredientDetails.filter(
    ing => ing.scientific_evidence && ing.scientific_evidence.includes('studies')
  );
  
  if (scientificallyBackedIngredients.length > 0) {
    insights.push(`This product contains ${scientificallyBackedIngredients.length} ingredients with scientific backing: ${scientificallyBackedIngredients.map(i => i.name).join(', ')}.`);
  }
  
  // Check for complementary ingredients
  const effectsCount = {};
  ingredientDetails.forEach(ing => {
    ing.common_effects.forEach(effect => {
      effectsCount[effect] = (effectsCount[effect] || 0) + 1;
    });
  });
  
  const complementaryEffects = Object.entries(effectsCount)
    .filter(([_, count]) => count > 1)
    .map(([effect]) => effect);
  
  if (complementaryEffects.length > 0) {
    insights.push(`Multiple ingredients work together to enhance ${complementaryEffects.join(', ')}.`);
  }
  
  // Add product type specific insights
  if (product.type === 'beverage') {
    insights.push('As a beverage, this product offers a convenient way to consume beneficial ingredients in an enjoyable format.');
  } else if (product.type === 'supplement') {
    insights.push('This supplement provides a concentrated dose of active ingredients for maximum effectiveness.');
  } else if (product.type === 'aromatherapy') {
    insights.push('Aromatherapy products work through the olfactory system to influence mood and wellbeing.');
  }
  
  // Add popularity insight if it's a top seller
  if (product.sales_data.units_sold > 100) {
    insights.push('This is one of our bestselling products, trusted by many customers.');
  }
  
  return insights;
};

module.exports = {
  getProductDetailWithRAG,
  enhanceRecommendationsWithRAG
};
