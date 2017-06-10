import {
    id,
    linq
} from "./linq";

let average = linq([1, 2, 3, 4, 5, 6]).averageBy(id);

console.log(average);