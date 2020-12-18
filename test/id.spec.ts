import * as assert from "assert";
import { id } from "../src/linq";

describe("id", () => {
    it("should return the same element as a result", () => {
        const element = { a: 5 };
        const identity = id(element);
        
        assert.deepStrictEqual(identity, element);
    });
});