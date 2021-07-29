export default class Numbers {
  constructor(firstNumber, secondNumber) {
    this.firstNumber = firstNumber;
    this.secondNumber = secondNumber;
    this.result = 0;
  }

  toMorze() {
    let digitArray = [];
    digitArray = String(this.result).split('');
    return digitArray.map(this.fromSybbolToMorze);
  }

  toRoman() {
    const discharge = [['I', 'V'],
      ['X', 'L'],
      ['C', 'D'],
      ['M', '']];

    const position = [[],
      [[0, 1, 0]],
      [[0, 2, 0]],
      [[0, 3, 0]],
      [[0, 1, 1], [0, 1, 0]],
      [[0, 1, 1]],
      [[0, 1, 0], [0, 1, 1]],
      [[0, 2, 0], [0, 1, 1]],
      [[0, 3, 0], [0, 1, 1]],
      [[1, 1, 0], [0, 1, 0]]];

    let romanNumber = '';

    const digitArray = String(this.result).split('');
    digitArray.reverse();
    digitArray.forEach((number, index) => {
      position[number].forEach((element) => {
        const romanDigit = discharge[index + element[0]][element[2]].repeat(element[1]);
        romanNumber = romanNumber.concat(romanDigit);
      });
    });

    return romanNumber.split('').reverse().join('');
  }

  fromSybbolToMorze(symbol) {
    switch (symbol) {
      case '0':
        return '-----';
      case '1':
        return '.----';
      case '2':
        return '..---';
      case '3':
        return '...--';
      case '4':
        return '....-';
      case '5':
        return '.....';
      case '6':
        return '-....';
      case '7':
        return '--...';
      case '8':
        return '---..';
      case '9':
        return '----.';
      default:
        return symbol;
    }
  }
}
