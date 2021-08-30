import { promisify } from 'util';
import { createConnection } from '../DBconnection.js';

export async function patientDefine() {
  const connection = createConnection();
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = 'CREATE TABLE IF NOT EXISTS patients ('
    + 'id VARCHAR(255),'
    + 'name VARCHAR(255),'
    + 'PRIMARY KEY (id))';
  await queryAsync(sqlQuery);
  connection.end();
}
