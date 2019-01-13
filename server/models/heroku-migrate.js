import pool from './dbconnection';
import createQuery from './createTables';

const queries = `${createQuery}`;

// Create tables on Heroku Postgres
pool.query(queries, () => {
  console.log('Tables Created');
  pool.end();
});
