import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}


let numbers = [1, 2, 3, 4, 5];
let numbersTimes10 = linq(numbers).select(i => i * 10);

for (let number of numbersTimes10) {
    console.log(number)
}