import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';

export default class AuthenticationSQL {
  constructor(connection) {
    this.connection = connection;
  }

  async create(user) {
    try {
      const uuid = uuidv1();
      const data = { id: uuid, login: user.login, password: user.password };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO users SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      return e.message;
    }
  }

  async getAllLogins() {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'SELECT login FROM users';
      const result = await queryAsync(sql);
      return result.map((item) => item.login);
    } catch (e) {
      return e.message;
    }
  }

  async getPatientByLogin(login) {
    try {
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT patients.*, users.password FROM patients
        INNER JOIN users ON
        patients.user_id = users.id AND
        users.login = ?`;
      const result = await queryAsync(sql, login);
      return result[0];
    } catch (e) {
      return e.message;
    }
  }
}
