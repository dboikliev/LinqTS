import { id, linq, print, seq } from './src/linq';
import { elementsSymbol } from './src/linq/element-wrapper';

const elements = linq([1, 2]).append(3, 4, 5)

console.log(print(elements));
console.log((elements.toArray()));