import * as assert from "assert";
import { linq } from "../src/linq";

describe("convertion to array tests", () => {
    it("should convert the linqble to an array", () => {
        const arr = linq([1,2,3,4,5]).toArray();

        assert(Array.isArray(arr));
    })

    it("should convert empty linqable to an empty array", () => {
        const arr = linq([]).toArray();

        assert(Array.isArray(arr));
        assert.equal(arr.length, 0);
    });
});