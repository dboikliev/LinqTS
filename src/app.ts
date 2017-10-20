import {
    id,
    linq,
    seq
} from "./linq";

console.log(seq(0, 1, 100)
.orderBy(id)
.thenBy(x => x % 2)
.thenBy(x => x.toString().length)
.toArray())