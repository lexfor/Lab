import pkg from 'sequelize';

const { DataTypes, UUIDV4 } = pkg;

export function patientDefine(sequelize) {
  sequelize.define('patient', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
    },
  });
}
