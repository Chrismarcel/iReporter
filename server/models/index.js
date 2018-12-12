import pool from './dbconnection';
import dropQuery from './dropTables';
import createQuery from './createTables';

const queries = `${dropQuery}${createQuery}`;

pool.query(queries, (err, res) => {
    console.log(err, res);
    pool.end();
});
