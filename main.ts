import { id, linq, print } from './src/linq';

const distinct = linq(['1', '2']).zip([1, 2]).zip([true, false]).selectMany(el => el);

print(distinct);

console.log(linq([6,7,8,9]).tap(el => console.log(el - 5)).toArray())