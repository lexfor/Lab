import { userDefine, patientDefine, resolutionDefine } from './models';

export async function initializeDB(connection) {
  await userDefine(connection);
  await patientDefine(connection);
  await resolutionDefine(connection);
}
