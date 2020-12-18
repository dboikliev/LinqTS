import * as assert from "assert";
import { linq } from "../src/linq";

describe("union", () => {
    it("should return all unique elements present in both sets", () => {
        assert.deepStrictEqual(linq([1,2,3,4]).union([3,4,5,6]).toArray(), [1,2,3,4,5,6]);
        assert.deepStrictEqual(linq([1,2,3,4]).union([5,6]).toArray(), [1,2,3,4,5,6]);
        assert.deepStrictEqual(linq([1,2,3,4]).union([]).toArray(), [1,2,3,4]);
        assert.deepStrictEqual(linq([]).union([1,2,3,4]).toArray(), [1,2,3,4]);
        assert.deepStrictEqual(linq([]).union([]).toArray(), []);
    });
});