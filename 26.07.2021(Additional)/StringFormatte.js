export default class StringFormatte {
  constructor(inputString) {
    if (!StringFormatte._instance) {
      StringFormatte._instance = this;
    }
    StringFormatte._instance.string = inputString;
    return StringFormatte._instance;
  }

  removeNonUniqueChars() {
    const symbols = [];
    const stringArray = Array.from(this.string);
    const outputArray = [];
    stringArray.forEach((item) => {
      if (symbols.indexOf(item) === -1) {
        symbols.push(item);
        outputArray.push(item);
      }
    });
    this.string = outputArray.join('');
  }
}
