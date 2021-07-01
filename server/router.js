const router = require('express').Router();
const controller = require('./controller/reviews.js');

//Route to get List Reviews
router.get('/reviews/', controller.get);

//Route to get Review Metadata
router.get('/reviews/meta', controller.getMeta);

//Post review
router.post('/reviews/', controller.post);

module.exports = router;