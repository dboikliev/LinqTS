import linq from "./linq";

let odds = [1, 3, 5, 7];
let evens = [2, 4, 6, 8];

let oddEvenPairs = linq(odds)
    .zip(evens, (odd, even) => ({ odd, even }));

for (let element of oddEvenPairs) {
    console.log(element);
}