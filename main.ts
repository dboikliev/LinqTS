import { id, linq, print } from './src/linq';

const els = linq([-5,-8, -15, 10, -13, 5, -8]).skipUntil(x => x > 0)

print(els);

console.log(els.toArray())