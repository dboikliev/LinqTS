import * as assert from "assert";
import { linq } from "../src/linq";

describe("where", () => {
    it("should return filter the elements in the sequence based on the predicate", () => {
        assert.deepStrictEqual(linq([1,2,3,4]).where(x => x % 2 == 0).toArray(), [2,4]);
        assert.deepStrictEqual(linq([1,2,3,4]).where(x => x > 0).toArray(), [1,2,3,4]);
        assert.deepStrictEqual(linq([1,2,3,4]).where(x => x > 4).toArray(), []);
    });

    it("should return an empty sequence if there are no elements in the linqable", () => {
        assert.deepStrictEqual(linq([]).where(x => x % 2 == 0).toArray(), []);
    });
});