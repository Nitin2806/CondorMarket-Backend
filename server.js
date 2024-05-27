const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
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

// MongoDB connection
mongoose.connect(env.MONGO_URL).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB:', err);
});

//default route
app.get('/', (req, res) => {
  res.send('Welcome to the e-commerce backend!');
});

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
