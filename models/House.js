const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  houseType: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('House', houseSchema);
