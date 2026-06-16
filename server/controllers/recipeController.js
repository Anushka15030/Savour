// server/controllers/recipeController.js
const Recipe = require('../models/Recipe');

// ── SEED DATA ──────────────────────────────────────────────────────────────────
const sampleRecipes = [
  {
    title: 'Butter Chicken (Murgh Makhani)',
    description: 'Creamy, aromatic Indian curry with tender chicken in a rich tomato-butter sauce. The ultimate comfort food loved worldwide.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
    category: 'Indian', cookingTime: 45, servings: 4, difficulty: 'Medium',
    featured: true, averageRating: 4.8, totalReviews: 124,
    tags: ['curry', 'chicken', 'creamy', 'popular'],
    ingredients: [
      { amount: '800', unit: 'g',    name: 'chicken breast, cubed' },
      { amount: '2',   unit: 'cups', name: 'tomato puree' },
      { amount: '1',   unit: 'cup',  name: 'heavy cream' },
      { amount: '4',   unit: 'tbsp', name: 'butter' },
      { amount: '2',   unit: 'tbsp', name: 'ginger-garlic paste' },
      { amount: '2',   unit: 'tsp',  name: 'garam masala' },
      { amount: '1',   unit: 'tsp',  name: 'turmeric powder' },
      { amount: '2',   unit: 'tsp',  name: 'red chili powder' },
      { amount: '1',   unit: 'tsp',  name: 'cumin seeds' },
      { amount: '2',   unit: 'tbsp', name: 'oil' },
      { amount: '',    unit: '',     name: 'Salt to taste' },
      { amount: '2',   unit: 'tbsp', name: 'fresh cilantro for garnish' },
    ],
    instructions: [
      { step: 1, description: 'Marinate chicken with yogurt, ginger-garlic paste, turmeric, and chili powder for at least 30 minutes.' },
      { step: 2, description: 'Heat oil in a pan over high heat. Sear the marinated chicken until golden brown on all sides. Set aside.' },
      { step: 3, description: 'In the same pan, melt butter. Add cumin seeds and let them splutter. Add ginger-garlic paste and sauté for 2 minutes.' },
      { step: 4, description: 'Add tomato puree and cook on medium heat for 10 minutes until the sauce thickens and oil separates.' },
      { step: 5, description: 'Add garam masala, salt, and the seared chicken. Stir well to coat the chicken with the sauce.' },
      { step: 6, description: 'Reduce heat to low. Pour in heavy cream and stir gently. Simmer for 10 minutes.' },
      { step: 7, description: 'Garnish with fresh cilantro and a drizzle of cream. Serve hot with naan or basmati rice.' },
    ],
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta dish with silky egg sauce, crispy pancetta, and Pecorino Romano. No cream needed — just pure Italian tradition.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    category: 'Italian', cookingTime: 25, servings: 2, difficulty: 'Medium',
    featured: true, averageRating: 4.7, totalReviews: 98,
    tags: ['pasta', 'italian', 'quick', 'classic'],
    ingredients: [
      { amount: '200', unit: 'g',      name: 'spaghetti' },
      { amount: '100', unit: 'g',      name: 'pancetta or guanciale, diced' },
      { amount: '3',   unit: '',       name: 'large eggs' },
      { amount: '50',  unit: 'g',      name: 'Pecorino Romano, grated' },
      { amount: '50',  unit: 'g',      name: 'Parmesan, grated' },
      { amount: '2',   unit: 'cloves', name: 'garlic' },
      { amount: '',    unit: '',       name: 'Freshly cracked black pepper' },
      { amount: '',    unit: '',       name: 'Salt for pasta water' },
    ],
    instructions: [
      { step: 1, description: 'Bring a large pot of salted water to a boil. Cook spaghetti until al dente, reserving 1 cup of pasta water.' },
      { step: 2, description: 'While pasta cooks, render pancetta in a large skillet over medium heat until crispy. Remove and set aside, keeping the fat in the pan.' },
      { step: 3, description: 'Whisk together eggs, Pecorino Romano, and Parmesan in a bowl. Season generously with black pepper.' },
      { step: 4, description: 'Remove skillet from heat. Add hot drained pasta to the pan and toss with the pancetta fat.' },
      { step: 5, description: 'Slowly pour the egg-cheese mixture over the pasta, tossing constantly. Add pasta water gradually to create a silky sauce.' },
      { step: 6, description: 'Add crispy pancetta back. Serve immediately with extra cheese and black pepper.' },
    ],
  },
  {
    title: 'Avocado & Quinoa Power Bowl',
    description: 'A nutritious vegan bowl loaded with protein-packed quinoa, creamy avocado, roasted vegetables, and a zesty lemon tahini dressing.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    category: 'Vegan', cookingTime: 30, servings: 2, difficulty: 'Easy',
    featured: true, averageRating: 4.5, totalReviews: 67,
    tags: ['vegan', 'healthy', 'bowl', 'quinoa'],
    ingredients: [
      { amount: '1',   unit: 'cup',  name: 'quinoa, rinsed' },
      { amount: '2',   unit: '',     name: 'ripe avocados, sliced' },
      { amount: '1',   unit: 'cup',  name: 'cherry tomatoes, halved' },
      { amount: '1',   unit: '',     name: 'cucumber, diced' },
      { amount: '1',   unit: 'cup',  name: 'roasted chickpeas' },
      { amount: '2',   unit: 'cups', name: 'baby spinach' },
      { amount: '3',   unit: 'tbsp', name: 'tahini' },
      { amount: '2',   unit: 'tbsp', name: 'lemon juice' },
      { amount: '1',   unit: 'tbsp', name: 'olive oil' },
      { amount: '',    unit: '',     name: 'Salt, pepper, paprika' },
    ],
    instructions: [
      { step: 1, description: 'Cook quinoa in 2 cups water with a pinch of salt. Bring to boil, reduce heat, cover, and simmer for 15 minutes.' },
      { step: 2, description: 'Toss chickpeas with olive oil, paprika, and salt. Roast at 200°C (400°F) for 25 minutes until crispy.' },
      { step: 3, description: 'Whisk tahini, lemon juice, 2 tbsp water, and a pinch of salt into a smooth dressing.' },
      { step: 4, description: 'Fluff quinoa with a fork and divide into bowls. Arrange spinach, tomatoes, cucumber, and avocado on top.' },
      { step: 5, description: 'Add crispy chickpeas and drizzle generously with tahini dressing. Serve immediately.' },
    ],
  },
  {
    title: 'Classic Chocolate Lava Cake',
    description: 'Individual warm chocolate cakes with a molten, gooey center. An elegant dessert that takes just 30 minutes and never fails to impress.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
    category: 'Desserts', cookingTime: 30, servings: 4, difficulty: 'Medium',
    featured: true, averageRating: 4.9, totalReviews: 203,
    tags: ['chocolate', 'dessert', 'baking', 'indulgent'],
    ingredients: [
      { amount: '200', unit: 'g',    name: 'dark chocolate (70%), chopped' },
      { amount: '100', unit: 'g',    name: 'unsalted butter' },
      { amount: '4',   unit: '',     name: 'large eggs' },
      { amount: '4',   unit: '',     name: 'egg yolks' },
      { amount: '100', unit: 'g',    name: 'caster sugar' },
      { amount: '2',   unit: 'tbsp', name: 'all-purpose flour' },
      { amount: '',    unit: '',     name: 'Butter and cocoa powder for ramekins' },
      { amount: '',    unit: '',     name: 'Vanilla ice cream to serve' },
    ],
    instructions: [
      { step: 1, description: 'Preheat oven to 220°C (425°F). Butter 4 ramekins and dust with cocoa powder. Shake out excess.' },
      { step: 2, description: 'Melt chocolate and butter together in a heatproof bowl over simmering water. Let cool slightly.' },
      { step: 3, description: 'Whisk eggs, egg yolks, and sugar until pale and slightly thickened, about 2 minutes.' },
      { step: 4, description: 'Fold the chocolate mixture into the eggs. Sift in flour and fold until just combined.' },
      { step: 5, description: 'Divide batter evenly among prepared ramekins. Can be refrigerated for up to 24 hours.' },
      { step: 6, description: 'Bake for 10–12 minutes until edges are firm but center still wobbles.' },
      { step: 7, description: 'Rest 1 minute, then run a knife around the edge and invert onto plates. Serve immediately with ice cream.' },
    ],
  },
  {
    title: 'Kung Pao Chicken',
    description: 'Bold and fiery Sichuan stir-fry with tender chicken, crunchy peanuts, dried chilies, and a perfectly balanced sweet-savory sauce.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
    category: 'Chinese', cookingTime: 20, servings: 3, difficulty: 'Easy',
    featured: false, averageRating: 4.6, totalReviews: 88,
    tags: ['chinese', 'spicy', 'stir-fry', 'quick'],
    ingredients: [
      { amount: '500', unit: 'g',    name: 'chicken breast, cubed' },
      { amount: '1/2', unit: 'cup',  name: 'roasted peanuts' },
      { amount: '8',   unit: '',     name: 'dried red chilies' },
      { amount: '3',   unit: '',     name: 'spring onions, sliced' },
      { amount: '3',   unit: 'cloves', name: 'garlic, minced' },
      { amount: '1',   unit: 'tbsp', name: 'ginger, minced' },
      { amount: '2',   unit: 'tbsp', name: 'soy sauce' },
      { amount: '1',   unit: 'tbsp', name: 'rice vinegar' },
      { amount: '1',   unit: 'tbsp', name: 'sugar' },
      { amount: '1',   unit: 'tsp',  name: 'Sichuan peppercorns' },
      { amount: '2',   unit: 'tbsp', name: 'vegetable oil' },
      { amount: '1',   unit: 'tsp',  name: 'cornstarch' },
    ],
    instructions: [
      { step: 1, description: 'Marinate chicken with soy sauce, cornstarch, and a splash of rice vinegar for 15 minutes.' },
      { step: 2, description: 'Mix sauce: soy sauce, rice vinegar, sugar, and 2 tbsp water. Set aside.' },
      { step: 3, description: 'Heat wok over high heat until smoking. Add oil, then Sichuan peppercorns and dried chilies. Fry 30 seconds.' },
      { step: 4, description: 'Add chicken and stir-fry on high heat for 3–4 minutes until golden and cooked through.' },
      { step: 5, description: 'Add garlic and ginger, toss for 30 seconds. Pour in the sauce and toss to coat.' },
      { step: 6, description: 'Add peanuts and spring onions. Toss once more and serve over steamed rice.' },
    ],
  },
  {
    title: 'Chicken Tacos with Mango Salsa',
    description: 'Vibrant Mexican street-style tacos with smoky grilled chicken, fresh mango salsa, and a cooling lime crema. Summer on a plate.',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
    category: 'Mexican', cookingTime: 35, servings: 4, difficulty: 'Easy',
    featured: false, averageRating: 4.7, totalReviews: 112,
    tags: ['tacos', 'mexican', 'chicken', 'fresh'],
    ingredients: [
      { amount: '600', unit: 'g',    name: 'chicken thighs' },
      { amount: '8',   unit: '',     name: 'small flour or corn tortillas' },
      { amount: '1',   unit: '',     name: 'ripe mango, diced' },
      { amount: '1',   unit: '',     name: 'red onion, finely diced' },
      { amount: '1',   unit: '',     name: 'jalapeño, seeded and minced' },
      { amount: '2',   unit: 'tbsp', name: 'fresh cilantro, chopped' },
      { amount: '2',   unit: '',     name: 'limes, juiced' },
      { amount: '1/2', unit: 'cup',  name: 'sour cream' },
      { amount: '2',   unit: 'tsp',  name: 'smoked paprika' },
      { amount: '1',   unit: 'tsp',  name: 'cumin' },
      { amount: '1',   unit: 'tsp',  name: 'garlic powder' },
    ],
    instructions: [
      { step: 1, description: 'Season chicken thighs with smoked paprika, cumin, garlic powder, salt, and a drizzle of oil.' },
      { step: 2, description: 'Grill or pan-sear chicken for 6–7 minutes per side until charred and cooked through. Rest 5 minutes, then slice.' },
      { step: 3, description: 'Make mango salsa: combine mango, red onion, jalapeño, cilantro, and juice of 1 lime. Season with salt.' },
      { step: 4, description: 'Make lime crema: mix sour cream with remaining lime juice and a pinch of salt.' },
      { step: 5, description: 'Warm tortillas on a dry skillet or directly over a gas flame for 30 seconds per side.' },
      { step: 6, description: 'Assemble tacos: spread lime crema, add chicken, top generously with mango salsa. Serve immediately.' },
    ],
  },
  {
    title: 'Classic American Smash Burger',
    description: 'The ultimate homemade smash burger with caramelized edges, two beef patties, melted American cheese, and all the classic fixings.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    category: 'American', cookingTime: 20, servings: 2, difficulty: 'Easy',
    featured: false, averageRating: 4.6, totalReviews: 78,
    tags: ['burger', 'beef', 'american', 'grilling'],
    ingredients: [
      { amount: '400', unit: 'g',      name: 'ground beef (80/20 fat ratio)' },
      { amount: '2',   unit: '',       name: 'brioche buns, toasted' },
      { amount: '4',   unit: 'slices', name: 'American cheese' },
      { amount: '2',   unit: 'leaves', name: 'iceberg lettuce' },
      { amount: '1',   unit: '',       name: 'large tomato, sliced' },
      { amount: '1/2', unit: '',       name: 'white onion, thinly sliced' },
      { amount: '4',   unit: '',       name: 'pickle slices' },
      { amount: '2',   unit: 'tbsp',   name: 'burger sauce (mayo + ketchup + mustard + pickle juice)' },
      { amount: '',    unit: '',       name: 'Salt and black pepper' },
    ],
    instructions: [
      { step: 1, description: 'Divide ground beef into 4 equal balls (100g each). Do not overwork the meat.' },
      { step: 2, description: 'Heat a cast iron skillet over very high heat until almost smoking. Add a thin layer of oil.' },
      { step: 3, description: 'Place beef balls on the skillet and immediately smash flat with a spatula. Season with salt and pepper.' },
      { step: 4, description: 'Cook for 2 minutes until edges are well browned. Flip, immediately top with cheese, cook 1 more minute.' },
      { step: 5, description: 'Mix burger sauce: mayo, ketchup, mustard, and pickle juice.' },
      { step: 6, description: 'Toast buns on the same skillet. Assemble: sauce on both buns, lettuce, tomato, pickles, onion, double patty.' },
    ],
  },
  {
    title: 'Greek Mezze Platter',
    description: 'A vibrant Mediterranean spread featuring homemade hummus, smoky baba ganoush, tzatziki, warm pita, olives, and seasonal vegetables.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    category: 'Mediterranean', cookingTime: 40, servings: 6, difficulty: 'Easy',
    featured: false, averageRating: 4.4, totalReviews: 55,
    tags: ['mediterranean', 'vegan', 'sharing', 'healthy'],
    ingredients: [
      { amount: '400', unit: 'g',    name: 'canned chickpeas, drained' },
      { amount: '3',   unit: 'tbsp', name: 'tahini' },
      { amount: '2',   unit: 'cloves', name: 'garlic' },
      { amount: '3',   unit: 'tbsp', name: 'lemon juice' },
      { amount: '1',   unit: '',     name: 'large eggplant' },
      { amount: '1',   unit: 'cup',  name: 'Greek yogurt' },
      { amount: '1',   unit: '',     name: 'cucumber, grated and squeezed dry' },
      { amount: '2',   unit: 'tbsp', name: 'fresh dill or mint' },
      { amount: '4',   unit: '',     name: 'pita breads' },
      { amount: '1',   unit: 'cup',  name: 'mixed olives' },
      { amount: '',    unit: '',     name: 'Olive oil, paprika, salt' },
    ],
    instructions: [
      { step: 1, description: 'Hummus: blend chickpeas, tahini, garlic, lemon juice, and 3 tbsp water until ultra-smooth. Season and drizzle olive oil.' },
      { step: 2, description: 'Baba Ganoush: char eggplant directly over gas flame or broiler until collapsed and smoky, ~20 minutes. Blend flesh with tahini, lemon, garlic, salt.' },
      { step: 3, description: 'Tzatziki: mix Greek yogurt, grated cucumber, minced garlic, dill, lemon juice, and salt. Chill 30 minutes.' },
      { step: 4, description: 'Warm pita breads on a hot dry skillet or over flame. Cut into wedges.' },
      { step: 5, description: 'Arrange all dips, olives, pita, and fresh vegetables on a large board. Garnish with paprika, olive oil, and herbs.' },
    ],
  },
];

// POST /api/recipes/seed
exports.seedRecipes = async (req, res) => {
  try {
    await Recipe.deleteMany({});
    const recipes = await Recipe.insertMany(sampleRecipes);
    res.json({ message: `✅ ${recipes.length} recipes seeded successfully!`, count: recipes.length });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
};

// GET /api/recipes  (search, filter, sort, paginate)
exports.getAllRecipes = async (req, res) => {
  try {
    const { search, category, difficulty, minRating, maxTime, sort = 'createdAt', page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) query.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } },
    ];
    if (category)   query.category      = category;
    if (difficulty) query.difficulty    = difficulty;
    if (minRating)  query.averageRating = { $gte: parseFloat(minRating) };
    if (maxTime)    query.cookingTime   = { $lte: parseInt(maxTime) };

    const sortObj = sort === 'rating' ? { averageRating: -1 }
                  : sort === 'time'   ? { cookingTime:   1  }
                  : sort === 'title'  ? { title:         1  }
                  :                    { createdAt:     -1  };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [recipes, total] = await Promise.all([
      Recipe.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Recipe.countDocuments(query),
    ]);

    res.json({ recipes, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes.' });
  }
};

// GET /api/recipes/featured
exports.getFeaturedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ featured: true }).sort({ averageRating: -1 }).limit(6);
    res.json({ recipes });
  } catch {
    res.status(500).json({ message: 'Failed to fetch featured recipes.' });
  }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json({ recipe });
  } catch {
    res.status(500).json({ message: 'Failed to fetch recipe.' });
  }
};

// POST /api/recipes  (protected)
exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/recipes/:id  (protected)
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json({ message: 'Recipe updated', recipe });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/recipes/:id  (protected)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to delete recipe.' });
  }
};

// POST /api/recipes/:id/reviews  (protected)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment are required.' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5.' });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });

    const alreadyReviewed = recipe.reviews.find(r => r.user.toString() === req.user.id.toString());
    if (alreadyReviewed) return res.status(409).json({ message: 'You have already reviewed this recipe.' });

    recipe.reviews.push({ user: req.user.id, userName: req.user.name, rating: parseInt(rating), comment });
    recipe.calculateAverageRating();
    await recipe.save();

    res.status(201).json({ message: 'Review added successfully', recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review.' });
  }
};
