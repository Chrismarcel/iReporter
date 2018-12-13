import HelperUtils from '../utils/HelperUtils';
import createTables from './createTables';
import dropTables from './dropTables';
import pool from './dbconnection';

const dropTablesQuery = dropTables;
const createTablesQuery = createTables;

const hashedPassword = HelperUtils.hashPassword('12345678');
const createUserQuery = `
    INSERT INTO users(firstname, lastname, othername, email, phonenumber, password, username) 
    VALUES('Chris', 'James', '', 'demouser@email.com', '07030045677', '${hashedPassword}', 'Chrismarcel') RETURNING *`;

const createAdminQuery = `
    INSERT INTO users(firstname, lastname, othername, email, phonenumber, password, username, role) 
    VALUES('Admin', 'Demo', '', 'admindemo@email.com', '07030048567', '${hashedPassword}', 'Admin', 1) RETURNING *`;

const queries = `${dropTablesQuery}${createTablesQuery}${createUserQuery};${createAdminQuery}`;

pool.query(queries, (err) => {
  if (err) {
    console.log('Error is', err);
  }
});
