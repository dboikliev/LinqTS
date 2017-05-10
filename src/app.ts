import { range, id, linq } from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];

range(1, 1, 100)
    .windowed(5)
    .forEach(console.log);