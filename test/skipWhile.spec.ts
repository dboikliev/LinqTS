import * as assert from "assert";
import { linq } from "../src/linq";

describe("skipWhile", () => {
    it("should skip elements from the beginning while they match a predicate", () => {
        const filtered = linq([2, 4, 6, 7, 8, 10])
            .skipWhile(x => x % 2 == 0)
            .toArray();

        assert.deepStrictEqual(filtered, [7, 8, 10]);

        const unchanged = linq([1, 2, 3, 4, 6, 7, 8, 10])
            .skipWhile(x => x % 2 == 0)
            .toArray();

        assert.deepStrictEqual(unchanged, [1, 2, 3, 4, 6, 7, 8, 10]);
    });
});