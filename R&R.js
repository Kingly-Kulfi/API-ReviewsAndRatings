const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
  product_id: Number,
  page: Number,
  count: Number,
  results: [{ review_id: {type: Number, unique: true}, rating: {type: Number, default: 0}, summary: {type: String, maxLength: 60}, recommend: {type: Boolean, default: false}, response: {type: String, minLength: 50, maxLength: 1000}, date: {type: Date, default: Date.now}, reviwer_name: {type: String, maxLength: 60}, helpfulness: {type: Number, default: 0}, photos: [{id: Number, url: String}]}]
});

const reviewsMetaSchema = new mongoose.Schema({
  product_id: Number,
  ratings: {
    1: {type: Number, default: 0},
    2: {type: Number, default: 0},
    3: {type: Number, default: 0},
    4: {type: Number, default: 0},
    5: {type: Number, default: 0}
  },
  recommend: {
    true: {type: Number, default: 0},
    false: {type: Number, default: 0}
  },
  characteristics: {
    Size: {id: Number, value: Number},
    Width: {id: Number, value: Number},
    Comfort: {id: Number, value: Number},
    Quality: {id: Number, value: Number},
    Length: {id: Number, value: Number},
    Fit: {id: Number, value: Number}
  }
});

const Reviews = mongoose.model('Reviews', reviewsSchema);
const ReviewsMeta = mongoose.model('ReviewsMeta', reviewsMetaSchema);