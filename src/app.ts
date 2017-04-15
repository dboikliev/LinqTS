import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people = range(1, 1)
    .take(10)
    .select(i => ({ name: i, friends: range(1, 1, 10).select(n => ({ name: "Inner" + n })) }));

let evenNums = range()
    .take(100)
    .where(i => i % 2 == 0)
    .groupBy(i => Math.floor(i / 10))
    .forEach(([key, values]) => console.log(key + " : " + values));


range(1, 1, 100).intersect(range(50, 1, 100)).forEach(console.log);
