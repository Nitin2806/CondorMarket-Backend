const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const env= process.env;

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, firstName, lastName, dateOfBirth, address, accountType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      address,
      accountType
    });


    const newUser = await user.save();

    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token, accountType: newUser.accountType });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Authenticate user and get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id },env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// //get profile for user in session
router.get('/profile', async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
// get all user profile for dashboard
router.get('/profiles', async (req, res) => {
  try {
    const profiles = await User.find().select('-password'); 
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//get user profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await User.findById(req.params.id);
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
//update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updateUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updateUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updateUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;