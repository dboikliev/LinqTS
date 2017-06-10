import {
    seq,
    linq
} from "./linq";

let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let oldest = linq(people).maxBy(p => p.age);

console.log(oldest);