import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people = range(1, 1)
    .take(10)
    .select(i => ({ name: i, friends: range(1, 1, 10).select(n => ({ name: "Inner" + n })) }));

var a = people.any(p => linq(p.friends).any(p => p.name.length == 0));

console.log(people.count());
