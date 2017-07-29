import {
    id,
    linq,
    seq
} from "./linq";

let sorted = seq(1, 1, 10)
    .zip(seq(1, 1, 10), (left, right) => ({ left, right: right.toString() }))
    .toArray();

console.log(sorted);