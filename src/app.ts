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

let x = linq(["Ivanko", "Didkos", "Dragan", "Petkan", "Gogogo"])
    .takeWhile(el => el.length === 6)
    .elementAt(50);

console.log(x);