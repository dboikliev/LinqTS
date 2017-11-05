import * as assert from "assert"
import { linq } from "../src/linq"

describe("skipWhile tests", () => {
    it("should skip elements of [2, 4, 6, 7, 8, 10] while they are even", () => {
        const elements = linq([2, 4, 6, 7, 8, 10])
            .skipWhile(x => x % 2 == 0)
            .toArray()

        assert.deepStrictEqual(elements, [7, 8, 10])
    })

    it("should skip none of the elements [2, 4, 6, 7, 8, 10] when the condition is that they are even", () => {
        const elements = linq([1, 2, 4, 6, 7, 8, 10])
            .skipWhile(x => x % 2 == 0)
            .toArray()

        assert.deepStrictEqual(elements, [1, 2, 4, 6, 7, 8, 10])
    })
})