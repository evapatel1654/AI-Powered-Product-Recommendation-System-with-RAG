const express = require('express');
const router = express.Router();
const products = require('../data/products.json');
const { getProductDetailWithRAG } = require('../rag/ragService');

// Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Enhance product details with RAG
    const enhancedProduct = await getProductDetailWithRAG(product);
    res.json(enhancedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
