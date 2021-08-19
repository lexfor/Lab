import StringFormatte from './StringFormatte';

export default class StringNumberFormatte extends StringFormatte {
  removeNonUniqueChars() {
    const numbers = [];
    const stringArray = Array.from(this.string);
    const outputArray = [];
    stringArray.forEach((item) => {
      if (Number.isNaN(parseInt(item, 10))) {
        if (numbers.indexOf(item) === -1) {
          numbers.push(item);
          outputArray.push(item);
        }
      }
    });
    this.string = outputArray.join('');
  }
}
