import { linq } from "./linq";

interface IPerson {
    name: string;
    age: number;
}

let people: IPerson[] = [{ name: "Ivan", age: 24 }, { name: "Deyan", age: 25 }];

let person = linq(people)
    .firstOrDefault(p => p.name === "John",() => ("NOBODY FOUND!"));

let type = typeof person;
if (type === "string") {
    console.log(person);
}
else {
    console.log((person as IPerson).name);
}