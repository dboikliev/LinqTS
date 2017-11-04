import * as assert from "assert"
import { linq } from "../src/linq"

describe("take tests", () => {
    it("should take a sequence of the the first element and skip the rest", () => {
        const arr = linq([1,2,3,4,5])
            .take(1)
            .toArray()

        assert.deepStrictEqual(arr, [1])
    })

    it("should take all elements when provided with the exact value of their count", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).take(iterable.length).toArray()

        assert.deepStrictEqual(sequence, iterable)
    })

    it("should take all elements when provided with a value larger than their count", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).take(iterable.length + 1).toArray()

        assert.deepStrictEqual(sequence, iterable)
    })

    it("should take none of the elements when provided with a value of 0", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).take(0).toArray()

        assert.deepStrictEqual(sequence, [])
    })

    it("should take none of the elements when provided with a value of less than 0", () => {
        let iterable = [1, 2, 3, 4, 5]
        const sequence = linq(iterable).take(-1).toArray()

        assert.deepStrictEqual(sequence, [])
    })
})