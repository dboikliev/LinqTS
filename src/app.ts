import {
    id,
    linq,
    seq
} from "./linq";

let sorted = seq(1, 1, 10)
    .take(3)
    .sum(id);

console.log(sorted);