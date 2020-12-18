import {  id, linq, print, seq } from './src/linq';

const elements = linq([1,1,2,3,3,4,5]).toMapMany(id, x => x * 10);
    
console.log((elements));