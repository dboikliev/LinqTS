# LinqTS

[![Build Status](https://travis-ci.org/dboikliev/LinqTS.svg?branch=master)](https://travis-ci.org/dboikliev/LinqTS)
[![Coverage Status](https://coveralls.io/repos/github/dboikliev/LinqTS/badge.svg?branch=master)](https://coveralls.io/github/dboikliev/LinqTS?branch=master)

An api for lazy querying of iterables, implemented in TypeScript and inspired by .NET's LINQ methods.

## Motivation

To implement a lazy API similar by using iterators in order to simplify data-oriented workflows greatly and to provide an API for C# developers familiar with the LINQ extension methods.

## Supported operations

1. [where](#where)
1. [select](#select)
1. [selectMany](#selectMany)
1. [distinct](#distinct)
1. [distinctBy](#distinctBy)
1. [zip](#zip)
1. [groupBy](#groupBy)
1. [join](#join)
1. [orderBy](#orderBy)
1. [orderByDescending](#orderByDescending)
1. [reverse](#reverse)
1. [skip](#skip)
1. [skipWhile](#skipWhile)
1. [take](#take)
1. [takeWhile](#takeWhile)
1. [except](#except)
1. [intersect](#intersect)
1. [concat](#concat)
1. [union](#union)
1. [xOr](#xOr)
1. [aggregate](#aggregate)
1. [windowed](#windowed)
1. [batch](#batch)
1. [any](#any)
1. [all](#all)
1. [min](#min)
1. [minBy](#minBy)
1. [max](#max)
1. [maxBy](#maxBy)
1. [average](#average)
1. [averageBy](#averageBy)
1. [sequenceEquals](#sequenceEquals)
1. [indexOf](#indexOf)
1. [lastIndexOf](#lastIndexOf)
1. [findIndex](#findIndex)
1. [findLastIndex](#findLastIndex)
1. [elementAt](#elementAt)
1. [first](#first)
1. [firstOrDefault](#firstOrDefault)
1. [last](#last)
1. [lastOrDefault](#lastOrDefault)
1. [forEach](#forEach)
1. [toArray](#toArray)
1. [count](#count)
1. [seq](#seq)
1. [id](#id)
1. [toMap](#toMap)
1. [toMapMany](#toMapMany)
1. [append](#append)
1. [prepend](#prepend)
1. [tap](#tap)

The function `print` is provided can be used to display tree-like representation of the operators in the console.

```typescript
import {  linq, print, seq } from './src/linq';

var elements = seq(1, 1, 10)
                .union(seq(1, 1, 15))
                .except([1,2])
                .union(linq([1,2,3]).intersect([2,3]))
                .skip(5)
                .skipWhile(x => x < 3)
                .groupBy(x => x % 2)
                .zip(seq(1,5))

console.log(print(elements));
```

```text
Linqable
    └──Zip (selector: (a, b) => [a, b])
        ├──Group (selector: x => x % 2)
        |   └──SkipWhile (predicate: x => x < 3)
        |       └──Skip (count: 5)
        |           └──Union
        |               ├──Except
        |               |   ├──Union
        |               |   |   ├──Sequence (start: 1, step: 1, end: 10)
        |               |   |   └──Sequence (start: 1, step: 1, end: 15)
        |               |   └──1,2
        |               └──Intersect
        |                   ├──1,2,3
        |                   └──2,3
        └──Sequence (start: 1, step: 5, end: Infinity)
```

## Examples

### Building and executing a query

The API any objects which are iterable in JavaScript. In order to use the method it is required to call `linq` with the object that we want to iterate as a parameter. The result of `linq` is `Linqable` object which supports the api. The linq module exports `linq`, `seq` and `id`.

```typescript
import { linq } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people: IPerson[] = [
    { name: "Ivan", age: 24 }, 
    { name: "Deyan", age: 25 }
];

linq(people)
    .where(p => p.age > 22)
    .select(p => p.name)
    .forEach(name => console.log(name))
```

```text
Ivan
Deyan
```

## Operations

### Where

Where filters the iterable based on a predicate function.
A sequence of the elements for which the predicate returns `true` will be returned.

```typescript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenNumbers = linq(numbers).where(i => i % 2 == 0);

for (let number of evenNumbers) {
    console.log(number)
}
```

```text
2
4
6
8
10
```

___

### Select

Each element of an iterable is trasnformed into another value - the return value of the function passed to `select`.

```typescript
let numbers = [1, 2, 3, 4, 5];
let numbersTimes10 = linq(numbers).select(i => i * 10);

for (let number of numbersTimes10) {
    console.log(number)
}
```

```text
10
20
30
40
50
```

___

### SelectMany

Flattens iterable elements into a single iterable sequence.
`selectMany` expects a function which takes an element from the sequence returns an iterable. All of the results are flattent into a single sequence.

```typescript
let numbers = [{
    inner: [1, 2, 3] 
}, {
    inner: [4, 5, 6]
}];

let flattened = linq(numbers).selectMany(x => x.inner);

for (let number of flattened) {
    console.log(number)
}
```

```text
1
2
3
4
5
6
```

___

### Distinct

Gets the distinct elements of a sequence based on an equality comparer function.
The function comapres the objects in the sequence and should return 'true' when they are considered equal.

```typescript
let numbers = [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }];

let distinct = linq(numbers).distinct((first, second) => first.value === second.value);

for (let number of distinct) {
    console.log(number)
}
```

```text
{ value: 1 }
{ value: 2 }
{ value: 3 }
```

___

### DistinctBy

Gets the distinct elements of a sequence based on a selector function. If a selector function is not passed, it will get the distinct elements by reference.

```typescript
let numbers = [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }];

let distinct = linq(numbers).distinctBy(el => el.value);

for (let number of distinct) {
    console.log(number)
}
```

```text
{ value: 1 }
{ value: 2 }
{ value: 3 }
```

___

### Zip

Applies a transformation function to each corresponding pair of elements from the iterables. The paring ends when the shorter sequence ends, the remaining elements of the other sequence are ignored.

```typescript
let odds = [1, 3, 5, 7];
let evens = [2, 4, 6, 8];

let oddEvenPairs = linq(odds)
    .zip(evens, (odd, even) => ({ odd, even }));

for (let element of oddEvenPairs) {
    console.log(element);
}
```

```text
{ odd: 1, even: 2 }
{ odd: 3, even: 4 }
{ odd: 5, even: 6 }
{ odd: 7, even: 8 }
```

___

### GroupBy

Groups elements based on a selector function. The function returns a sequence of arrays with the group key as the first element and an array of the group elements as the second element.

```typescript
let groups = linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).groupBy(i => i % 2);

for (let group of groups) {
    console.log(group);
}
```

```text
[ 1, [ 1, 3, 5, 7, 9 ] ]
[ 0, [ 2, 4, 6, 8, 10 ] ]
```

___

### Join

Performs a join on objects matching property values according to the provided leftSelector and rightSelector. The matching objects are merged into another value by resultSelector.

```typescript
let first = [{ name: "Ivan", age: 21 }];
let second = [{ name: "Ivan", phone: "0123456789" }];

let joined = linq(first).join(second, f => f.name, s => s.name, (f, s) => ({ name: f.name, age: f.age, phone: s.phone }));

for (let group of joined) {
    console.log(group);
}
```

```text
{ name: 'Ivan', age: 21, phone: '0123456789' }
```

___

### OrderBy

Orders elements in asceding order based on a selector function.

```typescript
let people = [
    { id: 1, age: 18 },
    { id: 2, age: 29 },
    { id: 3, age: 8 },
    { id: 4, age: 20 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let ordered = linq(people).orderBy(p => p.age)

for (let element of ordered) {
    console.log(element);
}
```

```text
{ id: 7, age: 5 }
{ id: 3, age: 8 }
{ id: 1, age: 18 }
{ id: 5, age: 18 }
{ id: 4, age: 20 }
{ id: 2, age: 29 }
{ id: 6, age: 32 }
```

___

### OrderByDescending

Equivalent of `orderBy`.
Orders elements in descending order based on a selector function.

___

### Reverse

Reverses the order of the sequence, e.g. reverse (1, 2, 3) -> (3, 2, 1)

```typescript
let reversed = linq([1, 2, 3, 4, 5, 6, 7, 8])
    .reverse()

for (let element of reversed) {
    console.log(element);
}
```

```text
8
7
6
5
4
3
2
1
```

___

### Skip

Skips a specific number of elements.

```typescript
let people = [
    { id: 1, age: 18 },
    { id: 2, age: 29 },
    { id: 3, age: 8 },
    { id: 4, age: 20 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let elements = linq(people).skip(3);

for (let element of elements) {
    console.log(element);
}
```

```text
{ id: 4, age: 20 }
{ id: 5, age: 18 }
{ id: 6, age: 32 }
{ id: 7, age: 5 }
```

___

### SkipWhile

Skips the elements in the sequence while the predicate returns `true`.

```typescript
let people = [
    { id: 1, age: 18 },
    { id: 2, age: 20 },
    { id: 3, age: 30 },
    { id: 4, age: 25 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let elements = linq(people).skipWhile(p => p.age % 2 === 0);

for (let element of elements) {
    console.log(element);
}
```

```text
{ id: 4, age: 25 }
{ id: 5, age: 18 }
{ id: 6, age: 32 }
{ id: 7, age: 5 }
```

___

### Take

Takes a specific number of elements.

```typescript
let people = [
    { id: 1, age: 18 },
    { id: 2, age: 20 },
    { id: 3, age: 30 },
    { id: 4, age: 25 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let elements = linq(people).take(4);

for (let element of elements) {
    console.log(element);
}
```

```text
{ id: 1, age: 18 },
{ id: 2, age: 20 },
{ id: 3, age: 30 },
{ id: 4, age: 25 }
```

___

### TakeWhile

Takes elements from the sequence while the predicate returns `true`.

```typescript
let people = [
    { id: 1, age: 18 },
    { id: 2, age: 20 },
    { id: 3, age: 30 },
    { id: 4, age: 25 },
    { id: 5, age: 18 },
    { id: 6, age: 32 },
    { id: 7, age: 5 },
];

let elements = linq(people).takeWhile(p => p.age % 2 === 0);

for (let element of elements) {
    console.log(element);
}
```

```text
{ id: 1, age: 18 },
{ id: 2, age: 20 },
{ id: 3, age: 30 }
```

___

### Except

Returns a sequence of elements which are not present in the sequence passed to `except`.

```typescript
let elements = linq([1, 2, 3, 4, 5, 6]).except([3, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

```text
1
2
4
```

___

### Intersect

Returns a sequence representing the intersection of the sequences - elements present in both sequences.

```typescript
let elements = linq([1, 2, 3, 4, 5, 6]).intersect([3, 5, 6, 7, 8]);

for (let element of elements) {
    console.log(element);
}
```

```text
3
5
6
```

___

### Concat

Concatenates the sequences together.

```typescript
let elements = linq([1, 2, 3]).concat([4, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

```text
1
2
3
4
5
6
```

___

### Union

Performs a union operation on the current sequence and the provided sequence and returns a sequence of unique elements present in the both sequences.

```typescript
let elements = linq([1, 2, 3, 3, 4, 5]).union([4, 5, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

```text
1
2
3
4
5
6
```

___

### xOr

Returns a sequence of the elements which are present in only one of the iterables.

```typescript
let elements = linq([1, 2, 3, 4]).xOr([2, 4, 5]);

for (let element of elements) {
    console.log(element);
}
```

```text
1
3
5
```

___

### Aggregate

Reduces the sequence into a value using an accumulator function.

```typescript
let people = [
    { name: "Ivan", age: 20 },
    { name: "Deyan", age: 22 }
];

let sumOfAges = linq(people).aggregate(0, (total, person) => total += person.age);

console.log(sumOfAges);
```

```text
42
```

___

### Windowed

Provides a sliding window of elements from the sequence. By default the windows slides 1 element over.
A second parameter may be provided to change the number of elements being skipped.

```typescript
let windows = linq([1, 2, 3, 4, 5, 6]).windowed(3, 2);

for (let window of windows) {
    console.log(window);
}
```

```text
[ 1, 2, 3 ]
[ 3, 4, 5 ]
[ 5, 6 ]
```

___

### Batch

Splits the sequence into batches/cunks of the specified size.

```typescript
let batches = linq([1, 2, 3, 4, 5, 6, 7, 8]).batch(3);

for (let batch of batches) {
    console.log(batch);
}
```

```text
[ 1, 2, 3 ]
[ 4, 5, 6 ]
[ 7, 8 ]
```

___

### Any

Checks if any of the elements match the provided predicate.

```typescript
let containsEven = linq([1, 2, 4, 6]).any(n => n % 2 === 0);

console.log(containsEven);
```

```text
true
```

#### All

Checks if all of the elements match the provided predicate.

```typescript
let areAllEvent = linq([1, 2, 4, 6]).all(n => n % 2 === 0);

console.log(areAllEvent);
```

```text
false
```

___

### Min

Gets the min element in a sequence. Applicable when the elements are of type `string` or `number`.

```typescript
let people = [1,5,-10,8];

console.log(linq(people).min());
```

```text
-10
```

___

### MinBy

Gets the min element in a sequence according to a transform function.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let youngest = linq(people).min(p => p.age);

console.log(youngest);
```

```text
{ name: 'Deyan', age: 22 }
```

___

### Max

Gets the max element in a sequence. Applicable when the elements are of type `string` or `number`.

```typescript
let people = [1,5,-10,8];

console.log(linq(people).max());
```

```text
8
```

___

### MaxBy

Gets the max element in a sequence according to a transform function.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let oldest = linq(people).max(p => p.age);

console.log(oldest);
```

```text
{ name: "Ivan", age: 25 }
```

___

### Average

Gets the averege value for a sequence. Applicable when the elements are of type `number`.

```typescript
let people = [25, 22];

console.log(linq(people).average(p => p.age));
```

```text
23.5
```

___

### AverageBy

Gets the averege of the values provided by a selector function.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let averageAge = linq(people).average(p => p.age);

console.log(averageAge);
```

```text
23.5
```

___

### SequenceEquals

Tests the equality of two seuqneces by checking each corresponding pair of elements against the provided predicate.
If a predicate is not provided the elements will be compared using the strict equality (===) operator.

```typescript
let first = [1, 2, 3];
let second = [1, 2, 3];

let areEqual = linq(first).sequenceEquals(second);

console.log(areEqual);
```

```text
true
```

___

### IndexOf

Gets the index of the first matching element in the sequence.

```typescript
linq([1, 2, 2, 2, 3]).indexOf(2);
```

```text
1
```

___

### LastIndexOf

Gets the index of the last matching element in the sequence.

```typescript
linq([1, 2, 2, 2, 3]).indexOf(2);
```

```text
1
```

___

### FindIndex

Gets the index of the first matching element in the sequence according to the predicate.

```typescript
linq([-1, -2, 2, 2, 3]).findIndex(x => x > 0);
```

```text
2
```
___

### FindLastIndex

Gets the index of the last matching element in the sequence according to the predicate.

```typescript
linq([-1, -2, 2, 2, 3]).findIndex(x => x > 0);
```

```text
4
```
___

### ElementAt

Gets the element at an index.

```typescript
let numbers = [1, 2, 3];

let elementAtIndexOne = linq(numbers).elementAt(1);

console.log(elementAtIndexOne);
```

```text
2
```

___

### First

Gets the first element of the iterable.

```typescript
let numbers = [1, 2, 3];

let firstElement = linq(numbers).first();

console.log(firstElement);
```

```text
1
```

### FirstOrDefault

Gets the first element of the sequence. If a predicate is provided the first element matching the predicated will be returned.
If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.

```typescript
let numbers = [1, 2, 3];

let firstEvenElement = linq(numbers).firstOrDefault(n => n % 2 === 0);
let firstElementLargerThanFive = linq(numbers).firstOrDefault(n => n > 5, () => -1);

console.log(firstEvenElement);
console.log(firstElementLargerThanFive);
```

```text
2
-1
```

___

### Last

Gets the last element of the iterable.

```typescript
let numbers = [1, 2, 3];

let lastElement = linq(numbers).last();

console.log(lastElement);
```

```text
3
```

___

### LastOrDefault

Gets the last element of the sequence. If a predicate is provided the last element matching the predicated will be returned.
If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.

```typescript
let numbers = [1, 2, 3, 4];

let lastEvenElement = linq(numbers).lastOrDefault(n => n % 2 === 0);
let lastElementLargerThanFive = linq(numbers).lastOrDefault(n => n > 5, () => -1);

console.log(lastEvenElement);
console.log(lastElementLargerThanFive);
```

```text
4
-1
```

___

### ForEach

Calls a function for each element of the sequence.
The function receives the element and its index in the seqeunce as parameters.

```typescript
linq([1, 2, 3, 4]).forEach(console.log);
```

```text
1 0
2 1
3 2
4 3
```

___

### ToArray

Turns the sequence to an array.

```typescript
let array = linq([1, 2, 3, 4])
    .concat([5, 6, 7])
    .toArray();

console.log(array);
```

```text
[ 1, 2, 3, 4, 5, 6, 7 ]
```

___

### Count

Counts the number of elements in the sequence.

```typescript
let count = linq([1, 2, 3, 4]).count();

console.log(count);
```

```text
4
```

___

### Seq

Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.

```typescript
let limited = seq(1, 2, 10).toArray();
console.log(limited);

let unlimited = seq(1, 2).take(15).toArray();
console.log(unlimited);
```

```text
[ 1, 3, 5, 7, 9 ]
[ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29 ]
```

___

### Id

The identity function (x => x). It takes an element and returns it.
It can be useful for operaions like min, max, average, and in general in cases where we want the transform function to return the same element.

```typescript
let average = linq([1, 2, 3, 4, 5, 6]).average(id);

console.log(average);
```

```text
3.5
```

___

### ToMap

Turns the sequence into a map.

The key is provided by a function which takes an element as a parameter and returns the value to be used as a key. An optional vlaue selector can be provided to select the value that will be put in the map.

An error will be thrown if multiple elements have the same key.

```typescript
const elements = linq([1,2,3,4,5]).toMap(id, x => x * 10);
    
console.log(elements);
```

```text
Map { 1 => 10, 2 => 20, 3 => 30, 4 => 40, 5 => 50 }
```

___

### ToMapMany

Turns the sequence into a map.

The key is provided by a function which takes an element as a parameter and returns the value to be used as a key. An optional vlaue selector can be provided to select the value that will be put in the map.

The values for each key will be aggregated into arrays.

```typescript
linq([1,1,2,3,3,4,5]).toMapMany(id, x => x * 10);
```

```text
Map {
  1 => [ 10, 10 ],
  2 => [ 20 ],
  3 => [ 30, 30 ],
  4 => [ 40 ],
  5 => [ 50 ]
}
```

___

### Append

Append the provided elements at the end of the sequence.

```typescript
linq([1,2,3,4,5]).append(6,7,8,9).toArray();
```

```text
[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

___

### Prepend

Prepends the provided elements at the beginning of the sequence.

```typescript
linq([6,7,8,9]).prepend(1,2,3,4,5).toArray();
```

```text
[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

___

### Tap

Executes an action on each element of the sequence and yields the element.

```typescript
linq([6,7,8,9]).tap(el => console.log(el - 5)).toArray();
```

```text
1
2
3
4
[ 6, 7, 8, 9 ]
```
