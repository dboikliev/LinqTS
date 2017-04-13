import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

    

let people = range(1, 1, 10)
    .select(i => ({ name: i, friends: range(1, 1, 10).select(n => ({ name: "Inner" + n })) }));

people.selectMany(p => p.friends)
    .orderBy((l, r) => -l.name.localeCompare(r.name))
    .distinct(p => p.name)
    .forEach(console.log);
