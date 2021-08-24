import pkg from 'sequelize';
import { DB_ACCESS } from '../../config.js';

const { Sequelize, DataTypes, UUIDV4 } = pkg;

const sequelize = new Sequelize(DB_ACCESS.database, DB_ACCESS.user, DB_ACCESS.password, {
  dialect: DB_ACCESS.dialect,
  host: DB_ACCESS.host,
  port: DB_ACCESS.port,
  logging: false,
});

const resolution = sequelize.define('resolution', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },

  value: {
    type: DataTypes.STRING,
  },

  delay: {
    type: DataTypes.INTEGER,
  },

  createdTime: {
    type: DataTypes.DATE,
  },
});

sequelize.sync({ force: true })
  .then(() => console.log('resolution table has been successfully created, if one doesn\'t exist'))
  .catch((error) => console.log('This error occurred', error));

export { resolution };

const patient = sequelize.define('patient', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },
});

patient.belongsTo(resolution, {
  foreignKey: {
    name: 'resolution_id',
    type: DataTypes.UUID,
  },
});

sequelize.sync({ force: true })
  .then(() => console.log('patient table has been successfully created, if one doesn\'t exist'))
  .catch((error) => console.log('This error occurred', error));

export { patient };
