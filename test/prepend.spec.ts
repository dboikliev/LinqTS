import * as assert from "assert";
import { linq } from "../src/linq";

describe("prepend", () => {
    it("should prepend the provided elements at the beginning of the sequence", () => {
        const elements = linq([1, 2, 3, 4])

        assert.deepStrictEqual(linq(elements).prepend(-1, 0).toArray(), [-1, 0, 1, 2, 3, 4]);
    });

    it("should prepend nothing when no elements are provided", () => {
        const elements = linq([1, 2, 3, 4])

        assert.deepStrictEqual(linq(elements).prepend().toArray(), [1, 2, 3, 4]);
    });
});