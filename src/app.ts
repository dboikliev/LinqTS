import {
    id,
    linq,
    seq
} from "./linq";

<<<<<<< HEAD

let reversed = seq(-10, 1, 10)
.orderBy(x => x == 0 ? 1 : Math.sign(x))
.thenByDescending(Math.abs)
=======
let reversed = linq([1, 2, 3, 4, 5, 6, 7, 8])
    .reverse()
>>>>>>> master

for (let element of reversed) {
    console.log(element);
}

