import { promisify } from 'util';
import { patientDefine } from './models/patientModel';
import { resolutionDefine } from './models/resolutionModel';
import { userDefine } from './models/userModel';

export async function initializeDB(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  await queryAsync('CREATE DATABASE IF NOT EXISTS lab');

  await userDefine(connection);
  await patientDefine(connection);
  await resolutionDefine(connection);
}
