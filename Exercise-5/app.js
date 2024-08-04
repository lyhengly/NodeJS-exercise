const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const Article = require('./models/Article');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/your_db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Helper function for pagination
function paginate(array, page, limit) {
  return array.slice((page - 1) * limit, page * limit);
}

// Get all articles with advanced search and pagination
app.get('/articles', async (req, res) => {
  const query = {};

  // Advanced search
  if (req.query.created_by) {
    query.created_by = req.query.created_by;
  }
  if (req.query.is_published) {
    query.is_published = req.query.is_published.toLowerCase() === 'true';
  }
  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: 'i' };
  }
  if (req.query.contents) {
    query.contents = { $regex: req.query.contents, $options: 'i' };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const articles = await Article.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Article.countDocuments(query);

    res.json({
      total: total,
      page: page,
      limit: limit,
      data: articles
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get article by ID
app.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    res.json(article);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new article
app.post('/articles', async (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    contents: req.body.contents,
    created_by: req.body.created_by,
    is_published: req.body.is_published
  });

  try {
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update article by ID
app.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');

    article.title = req.body.title || article.title;
    article.contents = req.body.contents || article.contents;
    article.is_published = req.body.is_published !== undefined ? req.body.is_published : article.is_published;
    article.updated_at = new Date();

    const updatedArticle = await article.save();
    res.json(updatedArticle);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete article by ID
app.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    
    await article.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all users with pagination
app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments();

    res.json({
      total: total,
      page: page,
      limit: limit,
      data: users
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create new user
app.post('/users', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    
    await user.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
