import {
    id,
    linq
} from "./linq";

let sorted = linq([1, 2, 3, -4, -5, -8, 10, -10, 7, -1, 0, -6])
    .orderBy(n => Math.sign(n))
    .thenBy(n => Math.abs(n))
    .toArray();

console.log(sorted);