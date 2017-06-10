import {
    seq,
    linq
} from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];

let elements = linq([1, 2, 3, 3, 4, 5]).union([4, 5, 5, 6]);

for (let element of elements) {
    console.log(element);
}