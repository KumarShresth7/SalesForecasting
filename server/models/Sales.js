const mongoose = require('mongoose');

const SalesDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  sales: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SalesData', SalesDataSchema);
