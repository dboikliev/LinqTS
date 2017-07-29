import {
    id,
    linq,
    seq
} from "./linq";

let sorted = seq(1, 1, 10)
    .windowed(3, 2)
    .toArray();

console.log(sorted);