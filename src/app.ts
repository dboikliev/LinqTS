import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}


let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenNumbers = linq(numbers).where(i => i % 2 == 0);

for (let number of evenNumbers) {
    console.log(number)
}