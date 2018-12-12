const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR (40) NOT NULL,
    lastname VARCHAR (40) NOT NULL,
    othername VARCHAR(40),
    email VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(14) NOT NULL,
    username VARCHAR (40),
    role INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createIncidentsTable = `
  CREATE TABLE IF NOT EXISTS incidents(
    id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(12) NOT NULL,
    latitude VARCHAR(25) NOT NULL,
    longitude VARCHAR(25) NOT NULL,
    media VARCHAR(25),
    status VARCHAR(13) DEFAULT 'drafted', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createTables = `${createUsersTable}${createIncidentsTable}`;

export default createTables;
