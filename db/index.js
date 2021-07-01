const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'sergioh',
  database: 'reviewsandratings',
  password: 'password05',
  port: 5432,
});

//Pool vs Query

// many querys
// client.connect();

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
  console.log(err, res)
  pool.end()
  } else {
    console.log(res.rows)
  }
})

module.exports = pool;