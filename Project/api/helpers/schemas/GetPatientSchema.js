import { MAX_LENGTH, MIN_LENGTH } from '../../../constants.js';

export const GetPatientSchema = {
  type: 'object',
  properties: {
    value: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
  },
  required: ['value'],
  additionalProperties: false,
};
