import { range, id, linq } from "./linq";

let first = [{ name: "Pesho" }];
let second = [{ name: "Pesho" }];

range(1, 1, 100)
    .windowed(5)
    .select(win => linq(win).averageBy(id))
    .forEach(console.log);