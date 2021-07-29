import Numbers from './Numbers';

export default class NumbersDevide extends Numbers {
  devide(resultView) {
    this.result = this.firstNumber / this.secondNumber;
    if (this.result < 0) {
      console.log('canot convert negative number');
      return this.result;
    }
    switch (resultView) {
      case 'roman':
        return this.toRoman();
      case 'morze':
        return this.toMorze();
      case 'arabiс':
        return this.result;
      default:
        return this.result;
    }
  }
}
