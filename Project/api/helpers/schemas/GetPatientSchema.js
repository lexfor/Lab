import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const GetPatientSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
  },
  required: ['name'],
  additionalProperties: false,
};
