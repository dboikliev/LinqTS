import {
    range,
    linq
} from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];

range(1, 1, 10).union(range(5, 1, 20)).forEach(e => console.log(e));