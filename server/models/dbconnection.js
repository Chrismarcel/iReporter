import dotenv from 'dotenv';

dotenv.config();

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

pool.on('connect', () => {
  console.log('Connected');
});

pool.on('remove', () => {
  console.log('Removed');
});

export default pool;
