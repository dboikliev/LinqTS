import { linq } from './src/linq';

const distinct = linq(['1', '2']).zip([1, 2]).zip([true, false], (a, b) => [...a, b])
console.log(distinct.toArray());