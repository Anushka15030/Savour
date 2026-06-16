// server/models/Recipe.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const recipeSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    image:       { type: String, default: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800' },
    category: {
      type: String, required: true,
      enum: ['Indian','Italian','Vegan','Desserts','Chinese','Mexican','American','Mediterranean'],
    },
    cookingTime: { type: Number, required: true, min: 1 },
    servings:    { type: Number, required: true, min: 1 },
    difficulty:  { type: String, enum: ['Easy','Medium','Hard'], default: 'Medium' },
    ingredients: [{ amount: String, unit: String, name: { type: String, required: true } }],
    instructions:[{ step: Number, description: { type: String, required: true } }],
    reviews:     [reviewSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:  { type: Number, default: 0 },
    tags:        [String],
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    featured:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Recalculate average rating after each new review
recipeSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews  = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.totalReviews  = this.reviews.length;
  }
};

module.exports = mongoose.model('Recipe', recipeSchema);
