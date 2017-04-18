import { linq, range } from "./linq";


let numbers = [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }];

let distinct = linq(numbers).distinct(el => el.value);

for (let number of distinct) {
    console.log(number)
}