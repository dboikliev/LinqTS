import { linq, seq } from "./linq";

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

let arr = ["Ivanko", "Didkos", "Dragan", "Petkan", "AA"];
let x = linq(arr)
    .firstOrDefault(n => n == "A", () => "too bad!");

console.log(x);