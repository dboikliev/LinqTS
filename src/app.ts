import { linq } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people: IPerson[] = [{ name: "Ivan", age: 24 }, { name: "Deyan", age: 25 }];

let namesOfPeopleOlderThan22 = linq(people)
    .where(p => p.age > 22)
    .select(p => p.name);

for (let length of namesOfPeopleOlderThan22) {
    console.log(length);
}