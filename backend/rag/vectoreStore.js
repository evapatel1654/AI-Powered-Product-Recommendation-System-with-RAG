// File: backend/rag/vectorStore.js
const fs = require('fs').promises;
const path = require('path');
const { getEmbeddings } = require('./embeddingModel');

// Simple in-memory vector store for the prototype
// In production, you would use a proper vector database like Pinecone, Qdrant, etc.
let vectorStore = {
  products: [], // Array of {id, content, embedding}
  ingredients: [] // Array of {name, content, embedding}
};

// Initialize vector store with product and ingredient data
const initializeVectorStore = async () => {
  try {
    // Load product data
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(await fs.readFile(productsPath, 'utf8'));
    
    // Load ingredient data
    const ingredientsPath = path.join(__dirname, '../data/ingredients.json');
    const ingredientsData = JSON.parse(await fs.readFile(ingredientsPath, 'utf8'));
    
    // Create embeddings for products
    for (const product of productsData) {
      const content = `${product.name}. ${product.description} Type: ${product.type}. Effects: ${product.effects.join(', ')}. Ingredients: ${product.ingredients.join(', ')}.`;
      const embedding = await getEmbeddings(content);
      
      vectorStore.products.push({
        id: product.id,
        content,
        embedding,
        product
      });
    }
    
    // Create embeddings for ingredients
    for (const ingredient of ingredientsData) {
      const content = `${ingredient.name}. Properties: ${ingredient.properties}. Effects: ${ingredient.common_effects.join(', ')}. Benefits: ${ingredient.benefits}. Scientific evidence: ${ingredient.scientific_evidence}`;
      const embedding = await getEmbeddings(content);
      
      vectorStore.ingredients.push({
        name: ingredient.name,
        content,
        embedding,
        ingredient
      });
    }
    
    console.log(`Vector store initialized with ${vectorStore.products.length} products and ${vectorStore.ingredients.length} ingredients`);
  } catch (error) {
    console.error('Error initializing vector store:', error);
    throw error;
  }
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
};

// Search for similar items in the vector store
const searchVectorStore = async (query, collection = 'products', limit = 5) => {
  try {
    // Get query embedding
    const queryEmbedding = await getEmbeddings(query);
    
    // Select the right collection
    const items = vectorStore[collection];
    
    // Calculate similarities and sort
    const results = items.map(item => ({
      ...item,
      similarity: cosineSimilarity(queryEmbedding, item.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
    
    return results;
  } catch (error) {
    console.error('Error searching vector store:', error);
    throw error;
  }
};

module.exports = {
  initializeVectorStore,
  searchVectorStore
};
