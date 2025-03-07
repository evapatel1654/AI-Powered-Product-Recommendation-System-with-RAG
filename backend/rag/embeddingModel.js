// File: backend/rag/embeddingModel.js
require('dotenv').config();
const cohere = require('cohere-ai');

cohere.init(process.env.COHERE_API_KEY);

const getEmbeddings = async (text) => {
  try {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3'
    });

    return response.body.embeddings[0]; // Extract the embedding vector
  } catch (error) {
    console.error('Error fetching embeddings:', error);
    return null;
  }
};

module.exports = { getEmbeddings };
