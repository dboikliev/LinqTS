import * as assert from "assert";
import { linq } from "../src/linq";

describe("except", () => {
    it("should return all elements that are not members of the provided set", () => {
        assert.deepStrictEqual(linq([1, 2, 3, 4]).except([3, 4, 5, 6]).toArray(), [1, 2]);
        assert.deepStrictEqual(linq([1, 2, 3, 4]).except([5, 6]).toArray(), [1, 2, 3, 4]);
        assert.deepStrictEqual(linq([1, 2, 3, 4]).except([]).toArray(), [1, 2, 3, 4]);
        assert.deepStrictEqual(linq([]).except([1, 2, 3, 4]).toArray(), []);
        assert.deepStrictEqual(linq([1, 2, 3, 4]).except([1, 2, 3, 4]).toArray(), []);
    });
});