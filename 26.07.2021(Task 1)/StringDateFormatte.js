/* eslint-disable no-useless-escape */
import StringFormatte from './StringFormatte';

export default class StringDateFormatte extends StringFormatte {
  removeNonUniqueChars() {
    this.string = this.string.replace(/(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g, '');
  }
}
