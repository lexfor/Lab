import { promisify } from 'util';
import { v1 as uuidv1 } from 'uuid';
import ApiError from '../../helpers/ApiError';
import { STATUSES } from '../../../constants';

class AuthenticationRepository {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create new user
   * @param {object} user
   * @returns {Promise<object>} user info
   */
  async createUser(user) {
    try {
      const uuid = uuidv1();
      const data = { id: uuid, ...user };
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = 'INSERT INTO users SET ?';
      await queryAsync(sql, data);
      return data;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }

  /**
   * Get user info
   * @param {string} login
   * @param {string} role
   * @returns {Promise<object>} user
   */
  async getUser(login, role) {
    try {
      let join = '';
      if (role === 'doctor') {
        join = `
        JOIN doctors ON 
        doctors.user_id = users.id`;
      }
      const queryAsync = promisify(this.connection.query).bind(this.connection);
      const sql = `SELECT users.* FROM users
        ${join}
        WHERE 
        login = ?`;
      const [result] = await queryAsync(sql, login);
      return result;
    } catch (e) {
      throw new ApiError(e.message, STATUSES.SERVER_ERROR);
    }
  }
}

export { AuthenticationRepository };
