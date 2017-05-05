import { range, id, linq } from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];

console.log(range(1, 1, 100).last());


console.log(linq([1, 2, 2, 2, 3]).minBy(id));
