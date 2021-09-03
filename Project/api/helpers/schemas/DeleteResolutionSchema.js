export const DeleteResolutionSchema = {
  type: 'object',
  properties: {
    patient_id: {
      type: 'string',
    },
  },
  required: ['patient_id'],
  additionalProperties: false,
};
