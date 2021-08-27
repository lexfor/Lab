import { promisify } from 'util';
import { createConnection } from './DBconnection.js';
import { patientDefine } from './api/models/patientModel.js';
import { resolutionDefine } from './api/models/resolutionModel.js';

export async function initializeDB() {
  const connection = createConnection();

  const queryAsync = promisify(connection.query).bind(connection);
  await queryAsync('DROP TABLE IF EXISTS resolutions');
  await queryAsync('DROP TABLE IF EXISTS patients');
  connection.end();

  await patientDefine(connection);
  await resolutionDefine(connection);

  return connection;
}
