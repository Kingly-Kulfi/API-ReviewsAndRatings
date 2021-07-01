require('newrelic');
import http from 'k6/http';
import { check, randomSeed, sleep } from 'k6';

//vitual user: vu
export let options = {
  stages: [
    { duration: '5s', target: 0 },
    { duration: '1m', target: 1000 },
    { duration: '5s', target: 0 },
  ],

  thresholds: {
    http_req_failed: ['rate<0.01'],   // http errors should be less than 1%
    http_req_duration: ['p(95)<100', 'max < 250'], // 95% of requests should be below 200ms, ,max duration under 250ms
  },
};

const localhost = 'http://localhost:3000'
randomSeed(0);

export default function () {

  const max = 1000011;
  let product_id = Math.floor(Math.random() * max) || 1;

  let res = http.get(`${localhost}/reviews?product_id=${product_id}`);

  // let res2 = http.get(`${localhost}/reviews/meta?product_id=${product_id}`);

  check(res, {
    'status is 200': (r) => r.status == 200,
    'response duration < 250ms': (r) => r.timings.duration < 250,
  });

  // check(res2, {
  //   'status is 200': (res2) => res2.status == 200,
  //   'response duration < 250ms': (res2) => res2.timings.duration < 250,
  // });

  sleep(1);
}