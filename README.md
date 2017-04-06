# LinqTS

An api for querying iterables, implemented in TypeScript and inspired by .NET's IEnumerable<T> extension methods.

## Supported operations:
1. where
2. select
3. distinct
4. zip
5. any
6. first
7. firstOrDefault

## Example

#### Building and executing a query:

```typescript
import { linq } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people: IPerson[] = [{ name: "Ivan", age: 24 }, { name: "Deyan", age: 25 }];

let namesOfPeopleOlderThan22 = linq(people)
    .where(p => p.age > 22)
    .select(p => p.name)

for (let length of namesOfPeopleOlderThan22) {
    console.log(length);
}
```

#### Result:

```
Ivan
Deyan
```
