// server/controllers/authController.js
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const Recipe = require('../models/Recipe');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already registered.' });

    const user  = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, favorites: [] },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    const token = generateToken(user._id);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, favorites: user.favorites },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites', 'title image averageRating cookingTime category difficulty');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, favorites: user.favorites } });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/auth/favorites/:recipeId  (protected) — toggle
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const recipeId = req.params.recipeId;
    if (!(await Recipe.findById(recipeId)))
      return res.status(404).json({ message: 'Recipe not found.' });

    const idx = user.favorites.indexOf(recipeId);
    if (idx === -1) {
      user.favorites.push(recipeId);
      await user.save();
      return res.json({ message: 'Added to favorites', favorited: true, favorites: user.favorites });
    } else {
      user.favorites.splice(idx, 1);
      await user.save();
      return res.json({ message: 'Removed from favorites', favorited: false, favorites: user.favorites });
    }
  } catch (err) {
    console.error('Favorite error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
