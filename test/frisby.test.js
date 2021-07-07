const frisby = require('frisby');

const server = 'http://localhost:3000'

const max = 1000011;
let product_id = Math.floor(Math.random() * max) || 1;

it ('GET reviews should return a status of 200', function () {
  return frisby
    .get(`${server}/reviews?product_id=${product_id}&sort=date`)
    .expect('status', 200);
});

it ('GET reviews metadata should return a status of 200', function () {
  return frisby
    .get(`${server}/reviews/meta?product_id=${product_id}`)
    .expect('status', 200);
});

it ('fetch POST should return a status of 201 Created', function () {
  return frisby
    .fetch(`${server}/reviews/`, {
      method: 'POST',
      body: JSON.stringify({
      product_id: 12,
      body: 'I enjoyed everything about this product, especially the style!',
      rating: 4,
      name: 'jackson111!',
      summary: 'Loved this product!',
      email: 'john123@gmail.com',
      recommend: false,
      photos: ['https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80', 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'],
      characteristics: {
          '39': 3,
          '40': 2,
          '41': 5,
          '42': 4
      }
    })
  })
    .expect('status', 201);
});