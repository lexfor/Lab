import StringFormatte from './StringFormatte';
import StringNumberFormatte from './StringNumberFormatte';
import StringDateFormatte from './StringDateFormatte';
import StringRegExpFormatte from './StringRegExpFormatte';

let str = new StringFormatte('Hello, world');
console.log(str.string);
str.removeNonUniqueChars();
console.log(str.string);

/* Функции удаляют повторные вхождения */

str = new StringNumberFormatte('Hello1, 1world!');
console.log(str.string);
str.removeNonUniqueChars();
console.log(str.string);

str = new StringDateFormatte('Hello,  01/01/1993  01/01/1993 01/01/1993 world!');
console.log(str.string);
str.removeNonUniqueChars();
console.log(str.string);

str = new StringRegExpFormatte('Hello, Hello world!', /Hello/);
console.log(str.string);
str.removeNonUniqueChars();
console.log(str.string);
