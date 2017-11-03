import {
    id,
    linq,
    seq
} from "./linq";


let reversed = seq(-10, 1, 10)
.orderBy(x => x == 0 ? 1 : Math.sign(x))
.thenByDescending(Math.abs)

for (let element of reversed) {
    console.log(element);
}

