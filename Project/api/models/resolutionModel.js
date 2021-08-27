import { promisify } from 'util';
import { createConnection } from '../../DBconnection.js';

export async function resolutionDefine() {
  const connection = createConnection();
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = 'CREATE TABLE IF NOT EXISTS resolutions ('
    + 'id VARCHAR(255),'
    + 'value VARCHAR(255),'
    + 'delay INT,'
    + 'createdTime VARCHAR(255),'
    + 'patient_id VARCHAR(255),'
    + 'PRIMARY KEY (id),'
    + 'FOREIGN KEY (patient_id) REFERENCES patients(id))';

  await queryAsync(sqlQuery);
  connection.end();
}
