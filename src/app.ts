import {
    seq,
    linq
} from "./linq";

let numbers = [1, 2, 3];

let indexOfTwo = linq(numbers).indexOf(2);

console.log(indexOfTwo);