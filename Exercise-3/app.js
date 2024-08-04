const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// To get all articles
app.get('/articles', (req, res) => {
  res.json(data.articles);
});

// To get article by ID
app.get('/articles/:id', (req, res) => {
  const article = data.articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).send('Article not found');
  res.json(article);
});

// To create new article
app.post('/articles', (req, res) => {
  const newArticle = {
    id: data.articles.length + 1,
    title: req.body.title,
    contents: req.body.contents,
    created_by: req.body.created_by,
    is_published: req.body.is_published,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  data.articles.push(newArticle);
  res.status(201).json(newArticle);
});

// To update article by ID
app.put('/articles/:id', (req, res) => {
  const article = data.articles.find(a => a.id === parseInt(req.params.id));
  if (!article) return res.status(404).send('Article not found');

  article.title = req.body.title || article.title;
  article.contents = req.body.contents || article.contents;
  article.is_published = req.body.is_published !== undefined ? req.body.is_published : article.is_published;
  article.updated_at = new Date().toISOString();
  res.json(article);
});

// To delete article by ID
app.delete('/articles/:id', (req, res) => {
  const articleIndex = data.articles.findIndex(a => a.id === parseInt(req.params.id));
  if (articleIndex === -1) return res.status(404).send('Article not found');
  
  data.articles.splice(articleIndex, 1);
  res.status(204).send();
});

// To get all users
app.get('/users', (req, res) => {
  res.json(data.users);
});

// To get user by ID
app.get('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// To create new user
app.post('/users', (req, res) => {
  const newUser = {
    id: data.users.length + 1,
    username: req.body.username,
    password: req.body.password
  };
  data.users.push(newUser);
  res.status(201).json(newUser);
});

// To update user by ID
app.put('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  user.username = req.body.username || user.username;
  user.password = req.body.password || user.password;
  res.json(user);
});

// To delete user by ID
app.delete('/users/:id', (req, res) => {
  const userIndex = data.users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('User not found');
  
  data.users.splice(userIndex, 1);
  res.status(204).send();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
