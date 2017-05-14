import { range, id, linq } from "./linq";

let first = [{ name: "Ivan", age: 21 }];
let second = [{ name: "Ivan", phone: "0123456789" }];

let joined = linq(first).join(second, f => f.name, s => s.name, (f, s) => ({ name: f.name, age: f.age, phone: s.phone }));

for (let group of joined) {
    console.log(group);
}
    