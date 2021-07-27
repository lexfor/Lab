import StringFormatte from './StringFormatte';

export default class StringNumberFormatte extends StringFormatte {
  removeNonUniqueChars() {
    const stringArray = Array.from(this.string);
    const outputArray = [];
    stringArray.forEach((item) => {
      if (Number.isNaN(parseInt(item, 10))) {
        outputArray.push(item);
      }
    });
    this.string = outputArray.join('');
  }
}
