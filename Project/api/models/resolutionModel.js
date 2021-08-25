import pkg from 'sequelize';

const { DataTypes, UUIDV4 } = pkg;

export function resolutionDefine(sequelize) {
  sequelize.define('resolution', {
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
      type: DataTypes.STRING,
    },
  });
}
