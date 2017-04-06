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

let evenNums = linq(range(0, 1, 10))
    .where(i => i % 2 === 0 && i >= 0)
    .select(i => i * 100)
    // .zip(gen(), (left, right) => [left, right])
    // .where(([_, right]) => right >= 1000)
    // .select(([left]) => left);

let i = 0;

for (let key of evenNums) {
    console.log(key);
    i++;
    if (i >= 10) {
        break;
    }
}