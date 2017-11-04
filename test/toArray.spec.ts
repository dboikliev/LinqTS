import * as assert from "assert"
import { linq } from "../src/linq"

describe("convertion to array tests", () => {
    it("should conver the linqble to an array", () => {
        const arr = linq([1,2,3,4,5]).toArray()

        assert(Array.isArray(arr))
    })
})