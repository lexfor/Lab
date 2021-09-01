import { promisify } from 'util';

export async function userDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    PRIMARY KEY (id))`;
  await queryAsync(sqlQuery);
}
