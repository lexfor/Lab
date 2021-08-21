import pkg from 'sequelize';
import { queue } from '../models/Model.js';

const { Sequelize } = pkg;

class QueueSQL {
  async push(id) {
    await queue.create({ patient_id: id });
    return 'pushed';
  }

  async shift() {
    const result = await queue.findAll({
      attributes: [[Sequelize.fn('min', Sequelize.col('id')), 'min']],
      raw: true,
    });
    await queue.destroy({
      where: {
        id: result[0].min,
      },
    });
    return 'shifted';
  }

  async getFirst() {
    let result = await queue.findOne();
    result = result.patient_id;
    return result;
  }

  async getAll() {
    const rows = await queue.findAll({
      attributes: ['patient_id'],
    });
    const result = rows.map((r) => r.dataValues.patient_id);
    return result;
  }
}

const queueInSQL = new QueueSQL();
export { queueInSQL };
