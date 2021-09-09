export const UserSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
  },
  required: ['id'],
  additionalProperties: true,
};
