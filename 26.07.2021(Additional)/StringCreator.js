import StringFormatte from './StringFormatte';

export default class StringCreator {
    constructor(str) {
        this.string = new StringFormatte(str);
    }
    clearingString(){
        this.string.removeNonUniqueChars()
    }
}
