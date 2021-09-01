import { MAX_LENGTH, MIN_LENGTH } from '../../../constants.js';

export const UserSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z]+',
    },
    birthday: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '([0-9]+)-([0-9]+)-([0-9]+)',
    },
    gender: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '(male)|(female)|(Male)|(Female)',
    },
  },
  required: ['id', 'name'],
  additionalProperties: true,
};
