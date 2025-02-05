// COMP 3133 
// Lab Test 1
// Author: Andrew Stewart
// Student ID: 101418564

const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
  from_user: { type: String, required: true },
  to_user: { type: String, required: true },
  message: { type: String, required: true },
  date_sent: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);