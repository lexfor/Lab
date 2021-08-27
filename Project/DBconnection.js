import * as mysql from 'mysql2';
import { DB_ACCESS } from './config.js';

export function createConnection() {
  const connection = mysql.createConnection({
    host: DB_ACCESS.host,
    user: DB_ACCESS.user,
    password: DB_ACCESS.password,
    database: DB_ACCESS.database,
  });
  return connection;
}
