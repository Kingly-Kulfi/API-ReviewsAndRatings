const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  product_id: Number,
  review_id: {
    type: Number,
    unique: true
  },
  rating: {
    type: Number,
    default: 0
  },
  summary: {
    type: String,
    maxLength: 60
  },
  recommend: {
    type: Boolean,
    default: false
  },
  response: {
    type: String,
    minLength: 50,
    maxLength: 1000
  },
  date: {
    type: Date,
    default: Date.now
  },
  reviewer_name: {
    type: String,
    maxLength: 60
  },
  reviewer_email: {
    type: String,
    maxLength: 60
  },
  helpfulness: {
    type: Number,
    default: 0
  },
  photos: [{
    photo_id: Number,
    url: String
  }],
  characteristics: {
    Size: {
      id: Number,
      value: Number
    },
    Width: {
      id: Number,
      value: Number
    },
    Comfort: {
      id: Number,
      value: Number
    },
    Quality: {
      id: Number,
      value: Number
    },
    Length: {
      id: Number,
      value: Number
    },
    Fit: {
      id: Number,
      value: Number
    }
  },
});

const Reviews = mongoose.model('Reviews', reviewsSchema);