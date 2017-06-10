import {
    seq,
    linq
} from "./linq";

let areAllEvent = linq([1, 2, 4, 6]).all(n => n % 2 === 0);

console.log("Are all even:", areAllEvent);