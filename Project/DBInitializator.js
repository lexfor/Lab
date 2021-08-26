import pkg from 'sequelize';
import { DB_ACCESS } from './config.js';
import { patientDefine } from './api/models/patientModel.js';
import { resolutionDefine } from './api/models/resolutionModel.js';
import { patientResolutionRelation } from './api/models/modelsRelations.js';

const { Sequelize } = pkg;

const sequelize = new Sequelize(DB_ACCESS.database, DB_ACCESS.user, DB_ACCESS.password, {
  dialect: DB_ACCESS.dialect,
  host: DB_ACCESS.host,
  port: DB_ACCESS.port,
  logging: false,
});

patientDefine(sequelize);
resolutionDefine(sequelize);

patientResolutionRelation(sequelize);

sequelize.sync({ force: true })
  .then(() => console.log('tables has been successfully created'))
  .catch((error) => console.log('This error occurred', error));

export { sequelize };
