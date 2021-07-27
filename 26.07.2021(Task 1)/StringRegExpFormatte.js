import StringFormatte from './StringFormatte';

export default class StringRegExpFormatte extends StringFormatte {
  constructor(inputString, regExp) {
    super(inputString);
    this.regExp = regExp;
  }

  removeNonUniqueChars() {
    this.string = this.string.replace(this.regExp, '');
  }
}
