import { 
    range,
    linq
} from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];


range(1, 1)
    .take(10)
    .concat(range(20, 10).take(20))
    .forEach(e => console.log(e));