import { linq, range } from "./linq";


let numbers = [{
    inner: [1, 2, 3] 
}, {
    inner: [4, 5, 6]
}];

let flattened = linq(numbers).selectMany(x => x.inner);

for (let number of flattened) {
    console.log(number)
}