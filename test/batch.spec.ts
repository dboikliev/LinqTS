import * as assert from "assert";
import { linq } from "../src/linq";

describe("batch tests", () => {
    it("should return batches of the specified size", () => {
        const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        let batches = linq(elements).batch(1);
        assert.deepStrictEqual(batches.toArray(), elements.map(el => [el]));

        batches = linq(elements).batch(2);
        assert.deepStrictEqual(batches.toArray(), [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]);

        batches = linq(elements).batch(5);
        assert.deepStrictEqual(batches.toArray(), [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]);

        batches = linq(elements).batch(10);
        assert.deepStrictEqual(batches.toArray(), [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]);
    });

    it("should skip the last batch if not of full size when the 'dropRemainder' flag is 'true'", () => {
        const elements = [1, 2, 3, 4, 5];

        let batches = linq(elements).batch(2, true);
        assert.deepStrictEqual(batches.toArray(), [[1, 2], [3, 4]]);

        batches = linq(elements).batch(6, true);
        assert.deepStrictEqual(batches.toArray(), []);

        batches = linq(elements).batch(5, true);
        assert.deepStrictEqual(batches.toArray(), [[1, 2, 3, 4, 5]]);
    });

    it("should return an empty sequence when size <= 0", () => {
        const elements = [1, 2, 3, 4, 5];

        let batches = linq(elements).batch(0, true);
        assert.deepStrictEqual(batches.toArray(), []);

        batches = linq(elements).batch(-1, true);
        assert.deepStrictEqual(batches.toArray(), []);
    });
});