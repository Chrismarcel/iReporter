import pool from './dbconnection';
import createQuery from './createTables';

const queries = `${createQuery}`;

pool.query(queries, () => {
  console.log('Tables Created');
  pool.end();
});
