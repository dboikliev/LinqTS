import {  linq, prettyPrint, seq } from './src/linq';

var elements = seq(1, 1, 10)
                .union(seq(1, 1, 15))
                .except([1,2])
                .union(linq([1,2,3]).intersect([2,3]))
                .skip(5)
                .skipWhile(x => x < 3)
                .groupBy(x => x % 2)
                .zip(seq(1,5))

console.log(prettyPrint(elements));