import * as assert from "assert";
import { linq } from "../src/linq";

describe("append", () => {
    it("should append the provided elements at the end of the sequence", () => {
        const elements = linq([1, 2, 3, 4])

        assert.deepStrictEqual(linq(elements).append(5, 6).toArray(), [1, 2, 3, 4, 5, 6]);
    });

    it("should append nothing when no elements are provided", () => {
        const elements = linq([1, 2, 3, 4])

        assert.deepStrictEqual(linq(elements).append().toArray(), [1, 2, 3, 4]);
    });
});