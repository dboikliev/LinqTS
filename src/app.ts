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

// let gen = function* () { 
//     let i = 0;
//     while (true) {
//         yield i++;
//     }
// }




let evenNums = linq(people)
    .groupBy(p => p.name)
    .select(([key, values]) => {
        let str = linq(values).aggregate('', (accumulated, value) => accumulated + JSON.stringify(value));
        return `${key}:${str}`;
    });

let cnt = 0;
for (let e of evenNums) {
    console.log(e);
    cnt++;
    if (cnt >= 10) {
        break;
    }
}