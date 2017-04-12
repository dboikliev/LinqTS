import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people = range(1, 1, 10)
    .select(i => ({ name: i, age: 10 }))

console.log(people.count());

let res = linq(people)
    .join(people, p => p.age, r => r.age, (left, right) => ({ left, right }))
    

console.log(people.count())
console.log(people.count())

console.log(res.count());