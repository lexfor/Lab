import { MIN_LENGTH } from '../../../constants';

export const DeleteResolutionSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string', minLength: MIN_LENGTH,
    },
  },
  required: ['id'],
  additionalProperties: false,
};
