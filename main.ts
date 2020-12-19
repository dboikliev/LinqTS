import { linq } from './src/linq';

const distinct = linq(['1', '2']).max()
console.log(distinct);