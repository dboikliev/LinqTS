import * as assert from "assert";
import { seq } from "../src/linq";

describe("seqeuence generator tests.", () => {
    it("should generate a sequence from 1 from 10 include, with a step of 1", () => {
        const sequence = seq(1, 1, 10).toArray();

        assert.deepStrictEqual(sequence, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    });
});