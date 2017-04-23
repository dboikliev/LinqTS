import linq from "./linq";

let odds = [1, 3, 5, 7];
let evens = [2, 4, 6, 8];

let areEqual = linq(odds)
    .sequenceEquals(evens);

console.log(areEqual);
    