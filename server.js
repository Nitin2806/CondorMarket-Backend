const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const cors = require('cors');
const app = express();
require('dotenv').config()
const PORT = process.env.PORT || 5000;

const env= process.env;

app.use(cors());

// Middleware
app.use(express.json());
// Products routes
app.use('/products', productRoutes);
// User routes
app.use('/users', userRoutes);
//Order routes
app.use('/orders', orderRoutes);

// MongoDB connection
mongoose.connect(env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB:', err);
});

//default route
app.get('/', (req, res) => {
  const routes = {
    '/products': {
      'GET': 'Get all products',
      'POST': 'Create a new product'
    },
    '/products/:id': {
      'GET': 'Get a product by ID',
      'PUT': 'Update a product',
      'DELETE': 'Delete a product'
    },
    '/users/register': 'Register a new user',
    '/users/login': 'Authenticate user and get token',
    '/users/profile': 'Get user profile (requires authentication)'
  };

  let html = '<!DOCTYPE html><html><head><title>API Routes</title></head><body>';
  html += '<h1>API Routes</h1>';

  for (const route in routes) {
    html += `<h2>${route}</h2>`;
    if (typeof routes[route] === 'object') {
      html += '<ul>';
      for (const method in routes[route]) {
        html += `<li><strong>${method}</strong>: ${routes[route][method]}</li>`;
      }
      html += '</ul>';
    } else {
      html += `<p>${routes[route]}</p>`;
    }
  }

  html += '</body></html>';

  res.send(html);
});


// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
