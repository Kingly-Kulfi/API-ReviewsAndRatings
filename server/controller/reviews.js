const models = require('../model/reviews.js');

module.exports = {
  get: function (req, res) {
    models.getReviews(
      (err, data) => {
        if (err) {
          res.status(500).send(err)
        } else {
        // Format review photos data into an array
         let reviewPhotos = [];
         for(j = 0; j< data.length; j++) {
          if(data[j].photo_ids === null) {
            reviewPhotos.push([]);
          } else {
            let photo_ids = (data[j].photo_ids).split(',');
            let photo_url = (data[j].photo_url).split(',');
            let photo_array = [];
            for (k = 0; k< photo_ids.length; k++){
              photo_array.push({id: parseInt(photo_ids[k]), url: photo_url[k]})
            }
            reviewPhotos.push(photo_array);
          }
         }
         //console.log(reviewsPhotos);
         //Format reviews object into an array
         let reviewsObject = {
          product: req.query.product_id,
          page: parseInt(req.query.page === undefined ? 1 : req.query.page),
          count: parseInt(req.query.count === undefined ? 5 : req.query.count),
          results: []
        };
         for(i = 0; i < data.length; i++) {
           reviewsObject.results.push({
             review_id: data[i].id,
             rating: data[i].rating,
             summary: data[i].summary,
             recommend: data[i].recommend,
             response: data[i].response,
             body: data[i].body,
             date: data[i].date,
             reviewer_name: data[i].reviewer_name,
             helpfulness: data[i].helpfulness,
             photos: reviewPhotos[i]
           });
         }

         // Slice results array based on page & count
         let resultsLength = reviewsObject.results.length;
         let maxPage = Math.floor(resultsLength/reviewsObject.count);

         if(reviewsObject.page <= maxPage) {
          reviewsObject.results = (reviewsObject.results).slice((reviewsObject.page - 1)*reviewsObject.count, (reviewsObject.page)*reviewsObject.count);
         } else {
          reviewsObject.results = (reviewsObject.results).slice((maxPage - 1)*reviewsObject.count, (maxPage)*reviewsObject.count);
         };

         //update page count
         reviewsObject.page = reviewsObject.page - 1;
         //console.log('controller: reviews object sliced:', reviewsObject);
          //do something with the data format object then send it back

          res.status(200).send(reviewsObject);
        }
      }, req.query);
    },

  getMeta: function (req, res) {
    let metaObject = {
      product_id: req.query.product_id,
      ratings: {},
      recommended: {},
      charactristics: {}
    };

    //1. Get Ratings metadata
    models.getReviewMetadataRatings(
      (err, data) => {
        if (err) {
          res.status(500).send(err)
        } else {
          for (i = 0; i < data.length; i++) {
            let rating = data[i].rating;
            let rating_value = data[i].reviews_count;
            metaObject.ratings[rating] = rating_value;
          }

        //2. Get Recommended metadata
        models.getReviewMetadataRecommended(
          (err, data) => {
            if (err) {
              res.status(500).send(err)
            } else {
              for (i = 0; i < data.length; i++) {
                let recommend = data[i].recommend;
                let recommend_count = data[i].recommend_count;
                metaObject.recommended[recommend] = recommend_count;
              }

              //3. Get Characteristics metadata
              models.getReviewMetadataCharacteristics(
                (err, data) => {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    for (i = 0; i < data.length; i++) {
                      let characteristic_description = data[i].name;
                      let id = (data[i].characteristic_id).split(',')[0];

                      if(data[i].characteristic_values !== null) {
                        let characteristic_valuesNum = (data[i].characteristic_values).split(',').map((j) => Number(j));
                        let numberOfValues = characteristic_valuesNum.length;
                        let sum = characteristic_valuesNum.reduce(function(a, b){
                          return a + b;
                        }, 0);
                        let value = sum/numberOfValues;
                        metaObject.charactristics[characteristic_description] = {'id': id, 'value': value};
                      } else {
                        let value = null;
                        metaObject.charactristics[characteristic_description] = {'id': id, 'value': value};
                      }

                    }
                    //console.log('controller getRecommended:', metaObject)
                    //Once complete send response back
                    res.status(200).send(metaObject);
                  }
                },
              req.query);
            }
          },
        req.query);
        }
      },
    req.query);
  },

  post: function (req, res) {
    //console.log(req.body);
    models.addReview(
      (err, data) => {
        if(err) {
          //console.log(err);
          res.status(500).send(err)
        } else {
          let review_id = data;
          let charIds = Object.keys(req.body.characteristics).map((j) => Number(j));
          let char_values = Object.values(req.body.characteristics);

          let charObject = {
            'review_id': review_id,
            'charIds': charIds,
            'values': char_values
          }
          //console.log(charObject)
          models.addCharacteristics(
            (err, data) => {
              if(err) {
                //console.log(err);
                res.status(500).send(err)
              } else {
                let photoObject = {
                  'review_id': review_id,
                  'photos': req.body.photos
                }
                models.addPhotos(
                  (err, data) => {
                    if(err) {
                      res.status(500).send(err)
                    } else {
                      res.status(201).send(JSON.stringify(data));
                    }
                  }, photoObject);
              }
            }, charObject);
          }
      }, req.body);
  }
}