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

seq(0, 1, 100)
.select(x => x.toString())
.sort({
    comparer: (a, b) => a - b,
    selector: {
        asc: true,
        property: x => x.length
    }
})