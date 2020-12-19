import { id, linq, print, seq } from './src/linq';
import { elementsSymbol } from './src/linq/element-wrapper';

const elements = linq([1, 2]).append(3, 4, 5).append(7).prepend(-3, -2, -1, 0);

console.log(print(elements));
console.log((elements.toArray()));