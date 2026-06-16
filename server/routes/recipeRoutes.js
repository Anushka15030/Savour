// server/routes/recipeRoutes.js
const express = require('express');
const router  = express.Router();
const recipe  = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/seed',              recipe.seedRecipes);
router.get('/featured',          recipe.getFeaturedRecipes);
router.get('/',                  recipe.getAllRecipes);
router.get('/:id',               recipe.getRecipeById);

// Protected
router.post('/',        protect, recipe.createRecipe);
router.put('/:id',      protect, recipe.updateRecipe);
router.delete('/:id',   protect, recipe.deleteRecipe);
router.post('/:id/reviews', protect, recipe.addReview);

module.exports = router;
