const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

module.exports = {
  query: (sql, params) => pool.query(sql, params),
  close: () => pool.end(),
};
