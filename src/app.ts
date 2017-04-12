import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people = range(1, 1, 10)
    .select(i => ({ name: i, friends: range(1, 1, 10).select(n => ({ name: "Inner" + n })) }));

people.selectMany(p => p.friends)
    .forEach(console.log);
