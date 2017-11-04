import * as assert from "assert"
import { seq } from "../src/linq"

describe("seqeuence generator tests.", () => {
    it("should generate a sequence from 1 from 10 included, with a step of 1", () => {
        const sequence = seq(1, 1, 10).toArray()

        assert.deepStrictEqual(sequence, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })

    it("should generate a sequence from 5 to -5 included, with a step of -1", () => {
        const sequence = seq(5, -1, -5).toArray()
        assert.deepStrictEqual(sequence, [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5])
    })

    it("should throw an error when called with a step of 0", () => {
        assert.throws(() => seq(5, 0))
    })
})