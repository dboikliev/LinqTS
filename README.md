# LinqTS

An api for querying iterables, implemented in TypeScript and inspired by .NET's IEnumerable<T> extension methods.

## Supported operations:
1. where
1. select
1. selectMany
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

## Example

#### Building and executing a query:

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
