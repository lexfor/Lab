export const QueueIDSchema = {
  type: 'object',
  properties: {
    queueID: {
      type: 'string',
    },
  },
  required: ['queueID'],
  additionalProperties: false,
};
