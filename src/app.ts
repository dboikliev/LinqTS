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


let evenNums = linq(range(0, 1))
    .skip(10)
    .take(10)
    .skip(5)
    .zip(gen(), (left, right) => [left, right])
    .select(([left]) => left);

let i = 0;

for (let element of evenNums) {
    console.log(element);
}