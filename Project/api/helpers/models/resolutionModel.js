import { promisify } from 'util';

export async function resolutionDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    delay INT,
    createdTime VARCHAR(255),
    patient_id VARCHAR(255),
    doctor_name VARCHAR(255),
    doctor_specialization VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (patient_id) REFERENCES patients(id))`;
  await queryAsync(sqlQuery);
}
