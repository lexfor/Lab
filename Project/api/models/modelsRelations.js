import pkg from 'sequelize';

const { DataTypes } = pkg;

export function patientResolutionRelation(sequelize) {
  sequelize.models.resolution.belongsTo(sequelize.models.patient, {
    foreignKey: {
      name: 'patient_id',
      type: DataTypes.UUID,
    },
  });
}
