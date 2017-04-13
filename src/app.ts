import { linq, range } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

    

let people = range(1, 1, 10)
    .select(i => ({ name: i, friends: range(1, 1, 10).select(n => ({ name: "Inner" + n })) }));

people.selectMany(p => p.friends)
    .takeWhile(p => linq(p.name).any(n => n.includes("I")))
    .distinct(p => p.name)
    // .orderBy((left, right) => {
    //     if (left.name > right.name) {
    //         return 1;
    //     }
        
    //     if (left.name == right.name) {
    //         return 0;
    //     }

    //     return -1;
    // })
    // .groupBy(p => p.name)
    .forEach(console.log);
