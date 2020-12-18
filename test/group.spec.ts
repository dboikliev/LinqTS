import * as assert from "assert";
import { linq } from "../src/linq";

describe("group", () => {
    it("should return an iterable of tuples where the first elements is the provided key and the second element is the grouping", () => {
        const elements = [{ author: "Ivan", book: "First"}, { author: "Ivan", book: "Second" }, { author: "John", book: "Third" }];
        
        let result = linq(elements).groupBy(el => el.author).toArray();
        assert.deepStrictEqual(result, [[elements[0].author, [elements[0], elements[1]]], [elements[2].author, [elements[2]]]]);
    });
});