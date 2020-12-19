import { linq } from './src/linq';

const numbers = [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }];

const distinct = linq(numbers)

for (const number of distinct) {
    console.log(number)
}