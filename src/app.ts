import {
    id,
    linq,
    seq
} from "./linq";

let groups = linq([1, 2, 3, 4, 5, 6, 7, 8]).batch(3);

for (let group of groups) {
    console.log(group);
}