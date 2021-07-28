/* eslint-disable no-useless-escape */
import StringFormatte from './StringFormatte';

export default class StringDateFormatte extends StringFormatte {
  removeNonUniqueChars() {
    let dates = [];
    dates = this.string.match(/(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g);
    dates = dates.filter((item, index) => dates.indexOf(item) === index);
    dates.forEach((item) => {
      const tempStringArray = this.string.split(item);
      tempStringArray.splice(1, 0, item);
      this.string = tempStringArray.join('');
    });
    return this.string;
  }
}
