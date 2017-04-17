# LinqTS

An api for lazy querying of iterables, implemented in TypeScript and inspired by .NET's LINQ methods.

## Motivation:

Implementing a lazy API similar to .NET's LINQ methods by using iterators.

## Supported operations:
1. [where](#where)
1. [select](#select)
1. [selectMany](#selectMany)
1. distinct
1. zip
1. groupBy
1. join
1. orderBy
1. skip
1. skipWhile
1. take
1. takeWhile
1. except
1. intersect
1. aggregate
1. any
1. all
1. minBy
1. maxBy
1. averageBy
1. elementAt
1. first
1. firstOrDefault
1. forEach
1. toArray
1. count

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

let namesOfPeopleOlderThan22 = linq(people)
    .where(p => p.age > 22)
    .select(p => p.name)

for (let name of namesOfPeopleOlderThan22) {
    console.log(name);
}
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
