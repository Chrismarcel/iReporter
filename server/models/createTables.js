const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR (40) NOT NULL,
    lastname VARCHAR (40) NOT NULL,
    othernames VARCHAR(40),
    email VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(65) NOT NULL,
    phonenumber VARCHAR(14) UNIQUE NOT NULL,
    username VARCHAR (40) UNIQUE NOT NULL,
    isAdmin VARCHAR (5) DEFAULT 'false',
    registered TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createIncidentsTable = `
  CREATE TABLE IF NOT EXISTS incidents(
    id SERIAL PRIMARY KEY NOT NULL,
    createdby INTEGER REFERENCES users(id),
    type VARCHAR(12) NOT NULL,
    comment VARCHAR(255) NOT NULL,
    latitude VARCHAR(25) NOT NULL,
    longitude VARCHAR(25) NOT NULL,
    Images VARCHAR(25)[],
    Videos VARCHAR(25)[],
    status VARCHAR(13) DEFAULT 'drafted', 
    createdat TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
`;

const createTables = `${createUsersTable}${createIncidentsTable}`;

export default createTables;
