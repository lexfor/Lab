import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const SetResolutionSchema = {
  type: 'object',
  properties: {
    value: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
    id: {
      type: 'string',
    },
  },
  required: ['value', 'id'],
  additionalProperties: false,
};
