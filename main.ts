import { id, linq, print } from './src/linq';

const distinct = linq(['1', '2']).zip([1, 2]).zip([true, false]).selectMany(el => el);

print(distinct);