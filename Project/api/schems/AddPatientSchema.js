import { MAX_LENGTH, MIN_LENGTH } from '../../constants.js';

export const AddPatientSchema = {
  type: 'string',
  maxLength: MAX_LENGTH,
  minLength: MIN_LENGTH,
};
