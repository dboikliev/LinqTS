import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people: IPerson[] = [
    { name: "Ivan", age: 24 }, 
    { name: "Deyan", age: 25 },
    { name: "Pesho", age: 26 },  
    { name: "Pesho", age: 36 }, 
    { name: "Deyan", age: 25 }, 
    { name: "Pesho", age: 27 }
];

let gen = function* () { 
    let i = 0;
    while (true) {
        yield i++;
    }
}

let num = linq(range(500, -1))
    .take(20000)
    .min();

console.log(num);