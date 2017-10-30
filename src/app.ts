import {
    id,
    linq,
    seq
} from "./linq";

let reversed = linq([1, 2, 3, 4, 5, 6, 7, 8])
    .reverse()

for (let element of reversed) {
    console.log(element);
}