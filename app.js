const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  // Verify token
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Example user
  const user = {
    id: 1,
    username: 'admin',
    email: 'admin@gmail.com'
  }

  // Sign token
  jwt.sign({user: user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token: token
    });
  });
});

// FORMAT OF TOKEN
// Authorizaion: Bearer <access_token>

// Verify Token middleware
function verifyToken (req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Access forbidden
    res.sendStatus(403);
  }
}

app.listen(PORT, () => console.log(`Server started. Listening to port:${PORT}`));
