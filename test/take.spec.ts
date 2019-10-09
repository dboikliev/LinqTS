import * as assert from "assert";
import { linq } from "../src/linq";

describe("take tests", () => {
    it("should take the specified number of elements from the sequence", () => {
        const take1 = linq([1, 2, 3, 4, 5])
            .take(1)
            .toArray();

        const take3 = linq([1, 2, 3, 4, 5])
            .take(3)
            .toArray();

        assert.deepStrictEqual(take1, [1]);
        assert.deepStrictEqual(take3, [1, 2, 3]);
    })

    it("should take all elements when provided with the exact value of their count", () => {
        let iterable = [1, 2, 3, 4, 5];
        const sequence = linq(iterable).take(iterable.length).toArray();

        assert.deepStrictEqual(sequence, iterable);
    })

    it("should take all elements when provided with a value larger than their count", () => {
        let iterable = [1, 2, 3, 4, 5];
        const sequence = linq(iterable).take(iterable.length + 1).toArray();

        assert.deepStrictEqual(sequence, iterable);
    })

    it("should take none of the elements when provided with a value of 0", () => {
        const iterable = [1, 2, 3, 4, 5];
        const sequence = linq(iterable).take(0).toArray();

        assert.deepStrictEqual(sequence, []);
    })

    it("should take none of the elements when provided with a value of less than 0", () => {
        const iterable = [1, 2, 3, 4, 5];
        const sequence = linq(iterable).take(-1).toArray();

        assert.deepStrictEqual(sequence, []);
    });
});