import HelperUtils from '../utils/HelperUtils';
import createTables from './createTables';
import dropTables from './dropTables';
import pool from './dbconnection';

const dropTablesQuery = dropTables;
const createTablesQuery = createTables;

const hashedPassword = HelperUtils.hashPassword('12345678');
const createUserQuery = `
    INSERT INTO users(firstname, lastname, othernames, email, phonenumber, password, username) 
    VALUES('Chris', 'James', '', 'demouser@email.com', '07030045677', '${hashedPassword}', 'Chrismarcel') RETURNING *`;

const createAdminQuery = `
    INSERT INTO users(firstname, lastname, othernames, email, phonenumber, password, username, isAdmin) 
    VALUES('Admin', 'Demo', '', 'admindemo@email.com', '07030048567', '${hashedPassword}', 'Admin', 'true') RETURNING *`;

const createIncident = `
INSERT INTO incidents(createdby, type, comment, latitude, longitude) VALUES(1, 'red-flag', 'This is a red-flag message', '6.5442452', '5.6788753')
`;

const queries = `${dropTablesQuery}${createTablesQuery}${createUserQuery};${createAdminQuery};${createIncident}`;

pool.query(queries, (err) => {
  if (err) {
    console.log('Error is', err);
  }
});
