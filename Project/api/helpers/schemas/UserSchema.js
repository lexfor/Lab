export const UserSchema = {
  type: 'object',
  properties: {
    user_id: {
      type: 'string',
    },
  },
  required: ['user_id'],
  additionalProperties: true,
};
