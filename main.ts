import { id, linq, print, seq } from './src/linq';
import { elementsSymbol } from './src/linq/element-wrapper';

const elements = linq([1, 2]).select((a, i) => a + " " + i);

console.log(print(elements));
console.log((elements.toArray()));