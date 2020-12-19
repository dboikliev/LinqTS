import * as assert from "assert";
import { linq } from "../src/linq";

describe("min", () => {
    it("should return the smallest number in the sequence", () => {
        assert.deepStrictEqual(linq([1, 2, 3, 4]).min(), 1);
        assert.deepStrictEqual(linq([1, 2, -5, 3, 0, 4]).min(), -5);
        assert.deepStrictEqual(linq([]).min(), undefined);
    });
});