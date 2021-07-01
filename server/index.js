const express = require('express');
const app = express();
const PORT = 3000;
const router = require('./router.js');
const db = require('../db');

app.use(express.json());

app.use('', router);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})