import { range, id, linq } from "./linq";

let people = [
    { id: 1, age: 18 },
    { id: 2, age: 29 },
    { id: 3, age: 8 },
    { id: 4, age: 20 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let elements = linq(people).skip(3);

for (let element of elements) {
    console.log(element);
}
    