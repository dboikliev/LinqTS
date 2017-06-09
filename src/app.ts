import { 
    seq,
    linq
} from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];


seq(1, 1, 10).union(seq(5, 1, 20)).forEach(e => console.log(e));
