const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  image: {type: String, required:true},
  brand: { type: String },
  price: { type: Number, required: true },
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
