const mongoose = require('mongoose');

// Define the URL Schema
const UrlSchema = mongoose.Schema({
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: function () {
      return Math.random().toString(36).substring(2, 8); // Generates a default short URL
    },
  },
});

// Export the model
module.exports = mongoose.model('Url', UrlSchema);
