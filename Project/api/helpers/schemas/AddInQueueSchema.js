export const AddInQueueSchema = {
  type: 'object',
  properties: {
    queueID: {
      type: 'string',
    },
  },
  required: ['queueID'],
  additionalProperties: false,
};
