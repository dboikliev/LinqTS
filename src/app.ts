import {
    id,
    linq,
    seq
} from "./linq";

let sorted = seq(1, 1, 10)
    .take(3)
    .sumBy(id);

console.log(sorted);