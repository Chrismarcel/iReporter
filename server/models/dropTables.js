const dropUsers = 'DROP TABLE IF EXISTS users CASCADE; ';
const dropIncidents = 'DROP TABLE IF EXISTS incidents CASCADE; ';

const dropQuery = `${dropUsers}${dropIncidents}`;

export default dropQuery;
