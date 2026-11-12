const { Pool, types } = require('pg');

types.setTypeParser(types.builtins.DATE, (data) => data);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;