import * as assert from "assert"
import { id } from "../src/linq"

describe("id tests", () => {
    it("should return the same element as a result", () => {
        const element = {};
        const identity = id(element);
        
        assert.deepStrictEqual(identity, element);
    })
})