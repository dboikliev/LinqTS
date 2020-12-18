import {  linq, print, seq } from './src/linq';

const elements = linq([1,2,3,3,3,4,4,5]).zip(seq(1, 1))
console.log(print(elements));