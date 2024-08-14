const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  images: { type: [String], required: true },
  brand: { type: String },
  new_price: { type: Number, required: true }, 
  old_price: { type: Number },
  description: { type: String },
  specifications: { type: Object },
  stock: { type: Number, required: true },
  ratings: { type: Number },
  reviews: [
    {
      user: { type: String },
      rating: { type: Number },
      comment: { type: String }
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);
