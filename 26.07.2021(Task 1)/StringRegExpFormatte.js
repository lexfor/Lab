import StringFormatte from './StringFormatte';

export default class StringRegExpFormatte extends StringFormatte {
  constructor(inputString, regExp) {
    super(inputString);
    this.regExp = regExp;
  }

  removeNonUniqueChars() {
    let strings = [];
    strings = this.string.match(this.regExp);
    strings = strings.filter((item, index) => strings.indexOf(item) === index);
    strings.forEach((item) => {
      const tempStringArray = this.string.split(item);
      tempStringArray.splice(1, 0, item);
      this.string = tempStringArray.join('');
    });
    return this.string;
  }
}
