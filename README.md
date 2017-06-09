# LinqTS

[![Build Status](https://travis-ci.org/dboikliev/LinqTS.svg?branch=master)](https://travis-ci.org/dboikliev/LinqTS)

An api for lazy querying of iterables, implemented in TypeScript and inspired by .NET's LINQ methods.

## Motivation:

Implementing a lazy API similar to .NET's LINQ methods by using iterators.

## Supported operations:
1. [where](#where)
1. [select](#select)
1. [selectMany](#selectMany)
1. [distinct](#distinct)
1. [zip](#zip)
1. [groupBy](#groupBy)
1. [join](#join)
1. [orderBy](#orderBy)
1. [skip](#skip)
1. skipWhile
1. take
1. takeWhile
1. except
1. intersect
1. concat
1. union
1. aggregate
1. windowed
1. any
1. all
1. minBy
1. maxBy
1. averageBy
1. sequenceEquals
1. indexOf
1. elementAt
1. first
1. firstOrDefault
1. last
1. lastOrDefault
1. forEach
1. toArray
1. count
1. range
1. id

## Examples:

#### Building and executing a query:

The API any objects which are iterable in JavaScript. In order to use the method it is required to call `linq` with the object that we want to iterate as a parameter. The result of `linq` is `Linqable` object which supports the api.

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

#### 1. Where<a id="where"></a>

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

#### 2. Select <a id="select"></a>

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

#### 3. SelectMany <a id="selectMany"></a>

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

#### 4. Distinct<a id="distinct"></a>

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

#### 5. Zip<a id="zip"></a>

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

#### 6. GroupBy<a id="groupBy"></a>

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

#### 7. Join<a id="join"></a>

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

#### 8. OrderBy<a id="orderBy"></a>

Orders elements based on a comparer function.

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

let ordered = linq(people).orderBy((a, b) => {
    if (a.age > b.age) {
        return 1;
    }
    else if (a.age < b.age) {
        return -1;
    }
    return 0;
})

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

#### 9. Skip<a id="skip"></a>

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