const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'data.json');

// Utility function to read data from the JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Utility function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Get all articles and users
app.get('/api/articles', (req, res) => {
  const data = readData();
  res.json(data.articles);
});

app.get('/api/users', (req, res) => {
  const data = readData();
  res.json(data.users);
});

// Create new article
app.post('/api/articles', (req, res) => {
  const data = readData();
  const newArticle = req.body;
  newArticle.id = data.articles.length + 1;
  data.articles.push(newArticle);
  writeData(data);
  res.status(201).json(newArticle);
});

// Create new user
app.post('/api/users', (req, res) => {
  const data = readData();
  const newUser = req.body;
  newUser.id = data.users.length + 1;
  data.users.push(newUser);
  writeData(data);
  res.status(201).json(newUser);
});

// Get article by id
app.get('/api/articles/:id', (req, res) => {
  const data = readData();
  const article = data.articles.find(a => a.id === parseInt(req.params.id));
  if (article) {
    res.json(article);
  } else {
    res.status(404).send('Article not found');
  }
});

// Get user by id
app.get('/api/users/:id', (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// Update article by id
app.put('/api/articles/:id', (req, res) => {
  const data = readData();
  const articleIndex = data.articles.findIndex(a => a.id === parseInt(req.params.id));
  if (articleIndex !== -1) {
    const updatedArticle = { ...data.articles[articleIndex], ...req.body };
    data.articles[articleIndex] = updatedArticle;
    writeData(data);
    res.json(updatedArticle);
  } else {
    res.status(404).send('Article not found');
  }
});

// Update user by id
app.put('/api/users/:id', (req, res) => {
  const data = readData();
  const userIndex = data.users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    const updatedUser = { ...data.users[userIndex], ...req.body };
    data.users[userIndex] = updatedUser;
    writeData(data);
    res.json(updatedUser);
  } else {
    res.status(404).send('User not found');
  }
});

// Delete article by id
app.delete('/api/articles/:id', (req, res) => {
  const data = readData();
  const newArticles = data.articles.filter(a => a.id !== parseInt(req.params.id));
  if (newArticles.length !== data.articles.length) {
    data.articles = newArticles;
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send('Article not found');
  }
});

// Delete user by id
app.delete('/api/users/:id', (req, res) => {
  const data = readData();
  const newUsers = data.users.filter(u => u.id !== parseInt(req.params.id));
  if (newUsers.length !== data.users.length) {
    data.users = newUsers;
    writeData(data);
    res.status(204).send();
  } else {
    res.status(404).send('User not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
