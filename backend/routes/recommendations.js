const express = require('express');
const router = express.Router();
const { getRecommendations, getPersonalizedRecommendations } = require('../services/recommendationService');

// Get general recommendations
router.get('/', async (req, res, next) => {
  try {
    const count = parseInt(req.query.count) || 4;
    const recommendations = await getRecommendations(count);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

// Get personalized recommendations based on user preferences
router.post('/personalized', async (req, res, next) => {
  try {
    const { preferences, userQuery, count = 4 } = req.body;
    
    if (!preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ message: 'Invalid preferences format' });
    }
    
    const recommendations = await getPersonalizedRecommendations(preferences, userQuery, count);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
