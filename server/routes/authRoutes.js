// server/routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup',              auth.signup);
router.post('/login',               auth.login);
router.get('/me',          protect, auth.getMe);
router.post('/favorites/:recipeId', protect, auth.toggleFavorite);

module.exports = router;
