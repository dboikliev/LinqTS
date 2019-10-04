# LinqTS

[![Build Status](https://travis-ci.org/dboikliev/LinqTS.svg?branch=master)](https://travis-ci.org/dboikliev/LinqTS) 
[![Coverage Status](https://coveralls.io/repos/github/dboikliev/LinqTS/badge.svg?branch=master)](https://coveralls.io/github/dboikliev/LinqTS?branch=master)

An api for lazy querying of iterables, implemented in TypeScript and inspired by .NET's LINQ methods.

## Motivation:

To implement a lazy API similar by using iterators in order to simplify data-oriented workflows greatly and to provide an API for C# developers familiar with the LINQ extension methods.

## Supported operations:
1. [where](#where)
1. [select](#select)
1. [selectMany](#selectMany)
1. [distinct](#distinct)
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
1. [aggregate](#aggregate)
1. [windowed](#windowed)
1. [batch](#batch)
1. [any](#any)
1. [all](#all)
1. [min](#min)
1. [max](#max)
1. [average](#average)
1. [sequenceEquals](#sequenceEquals)
1. [indexOf](#indexOf)
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

## Examples:

#### Building and executing a query:

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

#### Result:

```
Ivan
Deyan
```

## Operations:

#### Where<a id="where"></a>

Where filters the iterable based on a predicate function.
A sequence of the elements for which the predicate returns `true` will be returned.

```typescript
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let evenNumbers = linq(numbers).where(i => i % 2 == 0);

for (let number of evenNumbers) {
    console.log(number)
}
```

#### Result:

```
2
4
6
8
10
```

#### Select <a id="select"></a>

Each element of an iterable is trasnformed into another value - the return value of the function passed to `select`.

```typescript
let numbers = [1, 2, 3, 4, 5];
let numbersTimes10 = linq(numbers).select(i => i * 10);

for (let number of numbersTimes10) {
    console.log(number)
}
```

#### Result:

```
10
20
30
40
50
```

#### SelectMany <a id="selectMany"></a>

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

#### Result:

```
1
2
3
4
5
6
```

#### Distinct<a id="distinct"></a>

Gets the distinct elements of a sequence based on a selector function. If a selector function is not passed, it will get the distinct elements by reference.

```typescript
let numbers = [{ value: 1 }, { value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 }];

let distinct = linq(numbers).distinct(el => el.value);

for (let number of distinct) {
    console.log(number)
}
```

#### Result:

```
{ value: 1 }
{ value: 2 }
{ value: 3 }
```

#### Zip<a id="zip"></a>

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

#### Result:

```
{ odd: 1, even: 2 }
{ odd: 3, even: 4 }
{ odd: 5, even: 6 }
{ odd: 7, even: 8 }
```

#### GroupBy<a id="groupBy"></a>

Groups elements based on a selector function. The function returns a sequence of arrays with the group key as the first element and an array of the group elements as the second element.

```typescript
let groups = linq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).groupBy(i => i % 2);

for (let group of groups) {
    console.log(group);
}
```

#### Result:

```
[ 1, [ 1, 3, 5, 7, 9 ] ]
[ 0, [ 2, 4, 6, 8, 10 ] ]
```

#### Join<a id="join"></a>

Performs a join on objects matching property values according to the provided leftSelector and rightSelector. The matching objects are merged into another value by resultSelector.

```typescript
let first = [{ name: "Ivan", age: 21 }];
let second = [{ name: "Ivan", phone: "0123456789" }];

let joined = linq(first).join(second, f => f.name, s => s.name, (f, s) => ({ name: f.name, age: f.age, phone: s.phone }));

for (let group of joined) {
    console.log(group);
}
```

#### Result:

```
{ name: 'Ivan', age: 21, phone: '0123456789' }
```

#### OrderBy<a id="orderBy"></a>

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

#### Result:

```
{ id: 7, age: 5 }
{ id: 3, age: 8 }
{ id: 1, age: 18 }
{ id: 5, age: 18 }
{ id: 4, age: 20 }
{ id: 2, age: 29 }
{ id: 6, age: 32 }
```

#### OrderByDescending<a id="orderByDescending"></a>

Equivalent of `orderBy`.
Orders elements in descending order based on a selector function.

#### Reverse<a id="reverse"></a>

Reverses the order of the sequence, e.g. reverse (1, 2, 3) -> (3, 2, 1)

```typescript
let reversed = linq([1, 2, 3, 4, 5, 6, 7, 8])
    .reverse()

for (let element of reversed) {
    console.log(element);
}
```

#### Result:

```
8
7
6
5
4
3
2
1
```

#### Skip<a id="skip"></a>

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

#### Result:

```
{ id: 4, age: 20 }
{ id: 5, age: 18 }
{ id: 6, age: 32 }
{ id: 7, age: 5 }
```

#### SkipWhile<a id="skipWhile"></a>

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

#### Result:

```
{ id: 4, age: 25 }
{ id: 5, age: 18 }
{ id: 6, age: 32 }
{ id: 7, age: 5 }
```

#### Take<a id="take"></a>

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

#### Result:

```
{ id: 1, age: 18 },
{ id: 2, age: 20 },
{ id: 3, age: 30 },
{ id: 4, age: 25 }
```

#### TakeWhile<a id="takeWhile"></a>

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

#### Result:

```
{ id: 1, age: 18 },
{ id: 2, age: 20 },
{ id: 3, age: 30 }
```

#### Except<a id="except"></a>

Returns a sequence of elements which are not present in the sequence passed to `except`.

```typescript
let elements = linq([1, 2, 3, 4, 5, 6]).except([3, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

#### Result:

```
1
2
4
```

#### Intersect<a id="intersect"></a>

Returns a sequence representing the intersection of the sequences - elements present in both sequences.

```typescript
let elements = linq([1, 2, 3, 4, 5, 6]).intersect([3, 5, 6, 7, 8]);

for (let element of elements) {
    console.log(element);
}
```

#### Result:

```
3
5
6
```

#### Concat<a id="concat"></a>

Concatenates the sequences together.

```typescript
let elements = linq([1, 2, 3]).concat([4, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

#### Result:

```
1
2
3
4
5
6
```

#### Union<a id="union"></a>

Performs a union operation on the current sequence and the provided sequence and returns a sequence of unique elements present in the both sequences.

```typescript
let elements = linq([1, 2, 3, 3, 4, 5]).union([4, 5, 5, 6]);

for (let element of elements) {
    console.log(element);
}
```

#### Result:

```
1
2
3
4
5
6
```

#### Aggregate<a id="aggregate"></a>

Reduces the sequence into a value using an accumulator function.

```typescript
let people = [
    { name: "Ivan", age: 20 },
    { name: "Deyan", age: 22 }
];

let sumOfAges = linq(people).aggregate(0, (total, person) => total += person.age);

console.log(sumOfAges);
```

#### Result:

```
42
```

#### Windowed<a id="windowed"></a>

Provides a sliding window of elements from the sequence. By default the windows slides 1 element over.
A second parameter may be provided to change the number of elements being skipped.

```typescript
let windows = linq([1, 2, 3, 4, 5, 6]).windowed(3, 2);

for (let window of windows) {
    console.log(window);
}
```

#### Result:

```
[ 1, 2, 3 ]
[ 3, 4, 5 ]
[ 5, 6 ]
```

#### Batch<a id="batch"></a>

Splits the sequence into batches/cunks of the specified size.

```typescript
let batches = linq([1, 2, 3, 4, 5, 6, 7, 8]).batch(3);

for (let batch of batches) {
    console.log(batch);
}
```

#### Result:

```
[ 1, 2, 3 ]
[ 4, 5, 6 ]
[ 7, 8 ]
```

#### Any<a id="any"></a>

Checks if any of the elements match the provided predicate.

```typescript
let containsEven = linq([1, 2, 4, 6]).any(n => n % 2 === 0);

console.log(containsEven);
```

#### Result:

```
true
```

#### All<a id="all"></a>

Checks if all of the elements match the provided predicate.

```typescript
let areAllEvent = linq([1, 2, 4, 6]).all(n => n % 2 === 0);

console.log(areAllEvent);
```

#### Result:

```
false
```

#### Min<a id="min"></a>

Gets the min element in a sequence according to a transform function.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let youngest = linq(people).min(p => p.age);

console.log(youngest);
```

#### Result:

```
{ name: 'Deyan', age: 22 }
```

#### Max<a id="max"></a>

Gets the max element in a sequence according to a transform function.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let oldest = linq(people).max(p => p.age);

console.log(oldest);
```

#### Result:

```
{ name: "Ivan", age: 25 }
```

#### Average<a id="average"></a>

Gets the averege value for a sequence.

```typescript
let people = [
    { name: "Ivan", age: 25 },
    { name: "Deyan", age: 22 }
];

let averageAge = linq(people).average(p => p.age);

console.log(averageAge);
```

#### Result:

```
23.5
```

#### SequenceEquals<a id="sequenceEquals"></a>

Tests the equality of two seuqneces by checking each corresponding pair of elements against the provided predicate.
If a predicate is not provided the elements will be compared using the strict equality (===) operator.

```typescript
let first = [1, 2, 3];
let second = [1, 2, 3];

let areEqual = linq(first).sequenceEquals(second);

console.log(areEqual);
```

#### Result:

```
true
```

#### IndexOf<a id="indexOf"></a>

Gets the index of the element in the sequence.

```typescript
let numbers = [1, 2, 3];

let indexOfTwo = linq(numbers).indexOf(2);

console.log(indexOfTwo);
```

#### Result:

```
1
```

#### ElementAt<a id="elementAt"></a>

Gets the element at an index.

```typescript
let numbers = [1, 2, 3];

let elementAtIndexOne = linq(numbers).elementAt(1);

console.log(elementAtIndexOne);
```

#### Result:

```
2
```

#### First<a id="first"></a>

Gets the first element of the iterable.

```typescript
let numbers = [1, 2, 3];

let firstElement = linq(numbers).first();

console.log(firstElement);
```

#### Result:

```
1
```

#### FirstOrDefault<a id="firstOrDefault"></a>

Gets the first element of the sequence. If a predicate is provided the first element matching the predicated will be returned.
If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.

```typescript
let numbers = [1, 2, 3];

let firstEvenElement = linq(numbers).firstOrDefault(n => n % 2 === 0);
let firstElementLargerThanFive = linq(numbers).firstOrDefault(n => n > 5, () => -1);

console.log(firstEvenElement);
console.log(firstElementLargerThanFive);
```

#### Result:

```
2
-1
```

#### Last<a id="last"></a>

Gets the last element of the iterable.

```typescript
let numbers = [1, 2, 3];

let lastElement = linq(numbers).last();

console.log(lastElement);
```

#### Result:

```
3
```

#### LastOrDefault<a id="lastOrDefault"></a>

Gets the last element of the sequence. If a predicate is provided the last element matching the predicated will be returned.
If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.

```typescript
let numbers = [1, 2, 3, 4];

let lastEvenElement = linq(numbers).lastOrDefault(n => n % 2 === 0);
let lastElementLargerThanFive = linq(numbers).lastOrDefault(n => n > 5, () => -1);

console.log(lastEvenElement);
console.log(lastElementLargerThanFive);
```

#### Result:

```
4
-1
```

#### ForEach<a id="forEach"></a>

Calls a function for each element of the sequence.
The function receives the element and its index in the seqeunce as parameters.

```typescript
linq([1, 2, 3, 4]).forEach(console.log);
```

#### Result:

```
1 0
2 1
3 2
4 3
```

#### ToArray<a id="toArray"></a>

Turns the sequence to an array.

```typescript
let array = linq([1, 2, 3, 4])
    .concat([5, 6, 7])
    .toArray();

console.log(array);
```

#### Result:

```
[ 1, 2, 3, 4, 5, 6, 7 ]
```

#### Count<a id="count"></a>

Counts the number of elements in the sequence.

```typescript
let count = linq([1, 2, 3, 4]).count();

console.log(count);
```

#### Result:

```
4
```

#### Seq<a id="seq"></a>

Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.

```typescript
let limited = seq(1, 2, 10).toArray();
console.log(limited);

let unlimited = seq(1, 2).take(15).toArray();
console.log(unlimited);
```

#### Result:

```
[ 1, 3, 5, 7, 9 ]
[ 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29 ]
```

#### Id<a id="id"></a>

The identity function (x => x). It takes an element and returns it.
It can be useful for operaions like min, max, average, and in general in cases where we want the transform function to return the same element.

```typescript
let average = linq([1, 2, 3, 4, 5, 6]).average(id);

console.log(average);
```

#### Result:

```
3.5
```
