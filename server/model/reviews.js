const db = require('../../db/index.js');

//use models to only get data from database using query's
// do not manipulate data here
// instead manipulate it in controllers.

let getReviews = function(callback, paramObject) {
  let page = (paramObject.page === undefined) ? 1 : paramObject.page;
  let count = (paramObject.count === undefined) ? 5 : paramObject.count;
  let sort = (paramObject.sort === undefined) ? 'relevant' : paramObject.sort;
  let product_id = paramObject.product_id;
  let queryReview;

  //console.log('getReviews model data:', page, count, sort, product_id);

  // SELECT * FROM reviews INNER JOIN reviews_photos ON (reviews.id = reviews_photos.id) WHERE reviews.product_id = 1;

  // SELECT reviews.id, reviews.product_id, reviews_photos.review_id, reviews_photos.url FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2;

  // SELECT reviews.*, reviews_photos.id, reviews_photos.url FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2 ORDER BY helpfulness DESC;

  // SELECT reviews.*, STRING_AGG(to_char(reviews_photos.id, 'FM999999999999999999'), ',') photo_ids, STRING_AGG(reviews_photos.url, ', ') photo_url FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = ${product_id} GROUP BY reviews.id;

  if(sort === 'relevant') {
    //this helped the speed of querie search
    //created a traditional index for reviews - product.id ASC
    //created a traditional index for reviews_photos - review.id ASC
    let queryReview = `SELECT reviews.*, STRING_AGG(to_char(reviews_photos.id, 'FM999999999999999999'), ',') photo_ids, STRING_AGG(reviews_photos.url, ',') photo_url FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = ${product_id} GROUP BY reviews.id`;
    db.query(queryReview, (err, data) => {
      if(err) {
        callback(err);
      } else {
       //console.log(data.rows);
       callback(null, data.rows);
      }
    });
  } else {
    let queryReview = `SELECT reviews.*, STRING_AGG(to_char(reviews_photos.id, 'FM999999999999999999'), ',') photo_ids, STRING_AGG(reviews_photos.url, ',') photo_url FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = ${product_id} GROUP BY reviews.id ORDER BY ${sort} DESC`;
    db.query(queryReview, (err, data) => {
      if(err) {
        callback(err);
      } else {
       //console.log(data);
       callback(null, data.rows);
      }
    });
  }
}

/*
SELECT id, STRING_AGG(reviews_photos.url, ',') photos FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2 ORDER BY helpfulness DESC;

SELECT reviews.*, STRING_AGG(reviews_photos.url, ',') photos FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2 GROUP BY reviews.id;

SELECT reviews.*, STRING_AGG(reviews_photos.id, ',') photos FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2 GROUP BY reviews.id;

// good query
SELECT reviews.*, STRING_AGG(to_char(reviews_photos.id, '9'), ',') photo_ids, STRING_AGG(reviews_photos.url, ', ') photo_url  FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = 2 GROUP BY reviews.id;

// This works better
SELECT reviews.*, STRING_AGG(to_char(reviews_photos.id, 'FM999999999999999999'), ',') photo_ids, STRING_AGG(reviews_photos.url, ', ') photo_url  FROM reviews LEFT JOIN reviews_photos ON (reviews.id = reviews_photos.review_id) WHERE reviews.product_id = {product_id} GROUP BY reviews.id;
*/

let getReviewMetadataRatings = function(callback, paramObject) {
  let product_id = paramObject.product_id;
  //console.log('getReviewsMetadata data:', product_id);
  //this helped the speed of querie search
  //created a traditional index for reviews - product.id ASC (already created this but note: this benefits us here as well)
  let metaReviews = `SELECT reviews.rating, COUNT(reviews.rating) reviews_count FROM reviews WHERE product_id = ${product_id} GROUP BY reviews.rating`;

  db.query(metaReviews, (err, data) => {
    if(err) {
      callback(err);
    } else {
      //console.log(data.rows)
      callback(null, data.rows);
    }
  });
}

let getReviewMetadataRecommended = function(callback, paramObject) {
  let product_id = paramObject.product_id;
  //console.log('getReviewsMetadata data:', product_id);
  //this helped the speed of querie search
  //creted a multicolumn index table for reviews - product_id ASC --> recommend ASC
  let metaRecommended = ` (SELECT reviews.recommend, COUNT(reviews.recommend) recommend_count FROM reviews WHERE product_id = ${product_id} AND recommend = false GROUP BY reviews.recommend) UNION ALL ( SELECT reviews.recommend, COUNT(reviews.recommend) recommend_count FROM reviews WHERE product_id = ${product_id} AND recommend = true GROUP BY reviews.recommend)`;

  db.query(metaRecommended, (err, data) => {
    if(err) {
      callback(err);
    } else {
      //console.log(data.rows)
      callback(null, data.rows);
    }
  });
}

let getReviewMetadataCharacteristics= function(callback, paramObject) {
  let product_id = paramObject.product_id;
  //console.log('getReviewsMetadata data:', product_id);
  //this helped the speed of querie search
  //created a traditional index table for characteristic - product_id ASC
  //created a traditional index table for characteristic_reviews - characteristic_id ASC
  let metaCharacteristics = `SELECT characteristics.name, STRING_AGG(to_char(characteristic_reviews.value, 'FM999999999999999999'), ', ') characteristic_values, STRING_AGG(to_char(characteristics.id, 'FM999999999999999999'), ', ') characteristic_id FROM characteristics LEFT JOIN characteristic_reviews ON (characteristics.id = characteristic_reviews.characteristic_id) WHERE product_id = ${product_id} GROUP BY characteristics.name`;

  db.query(metaCharacteristics, (err, data) => {
    if(err) {
      callback(err);
    } else {
      //console.log(data.rows)
      callback(null, data.rows);
    }
  });
}

let addReview = function(callback, reviewObject) {
  let product_id = reviewObject.product_id;

  //need to incorporate photos in this query
  let queryReview = `INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES (${product_id}, ${reviewObject.rating}, '${reviewObject.summary}', '${reviewObject.body}', ${reviewObject.recommend}, '${reviewObject.name}', '${reviewObject.email}') RETURNING *`;

  //included a RETURNING statement in query to get the  reviews id when inserting a value

  db.query(queryReview, (err, data) => {
    if(err) {
      callback(err);
    } else {
      //console.log(data);
      callback(null, data.rows[0].id)
    }
  });
}

let addCharacteristics = function(callback, charObject) {
  let queryCharac = `INSERT INTO characteristic_reviews(review_id, characteristic_id, value) VALUES (${charObject.review_id}, UNNEST(ARRAY[${charObject.charIds}]), UNNEST(ARRAY[${charObject.values}])) RETURNING *`;

  db.query(queryCharac, (err, data) => {
    if(err) {
      callback(err);
    } else {
      callback(null, data.rows)
    }
  });
}

let addPhotos = function(callback, photoObject) {
  //console.log(photoObject);
  let queryPhoto = `INSERT INTO reviews_photos(review_id, url) VALUES (${photoObject.review_id}, UNNEST(ARRAY['${photoObject.photos}'])) RETURNING *`;

  db.query(queryPhoto, (err, data) => {
    if(err) {
      //console.log(err);
      callback(err);
    } else {
      //console.log(data.rows);
      callback(null, data.rows)
    }
  });
}

module.exports.getReviews = getReviews;
module.exports.getReviewMetadataRatings = getReviewMetadataRatings;
module.exports.getReviewMetadataRecommended = getReviewMetadataRecommended;
module.exports.getReviewMetadataCharacteristics = getReviewMetadataCharacteristics;
module.exports.addReview = addReview;
module.exports.addCharacteristics = addCharacteristics;
module.exports.addPhotos = addPhotos;