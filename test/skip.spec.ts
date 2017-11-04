import * as assert from "assert"
import { linq } from "../src/linq"

describe("skip tests", () => {
    it("should skip the first element and return a sequence of the rest", () => {
        const arr = linq([1,2,3,4,5])
            .skip(1)
            .toArray()

        assert.deepStrictEqual(arr, [2, 3, 4, 5])
    })

    it("should skip all elements when provided with the exact value of their count an return an empty sequence", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).skip(iterable.length).toArray()

        assert.deepStrictEqual(sequence, [])
    })

    it("should skip all elements when provided with a value larger than their count an return an empty sequence", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).skip(iterable.length + 1).toArray()

        assert.deepStrictEqual(sequence, [])
    })

    it("should skip none of the elements when provided with a value of 0", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).skip(0).toArray()

        assert.deepStrictEqual(sequence, iterable)
    })

    it("should skip none of the elements when provided with a value of less than 0", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).skip(-1).toArray()

        assert.deepStrictEqual(sequence, iterable)
    })
})