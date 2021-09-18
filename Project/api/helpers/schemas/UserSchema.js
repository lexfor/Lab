import { MAX_LENGTH, MIN_LENGTH } from '../../../constants';

export const UserSchema = {
  type: 'object',
  properties: {
    login: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '([0-9A-Za-z]+)@([a-z]+).([a-z]+)',
    },
    password: {
      type: 'string', maxLength: MAX_LENGTH, minLength: MIN_LENGTH, pattern: '[a-zA-Z0-9]+',
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
  required: ['login', 'password', 'name', 'birthday', 'gender'],
  additionalProperties: false,
};
