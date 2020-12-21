import * as assert from "assert";
import { linq, seq } from "../src/linq";

describe("tap", () => {
    it("should execute an action on each element and yield the element", () => {
        const tapped = [];
        const elements = linq([1, 2, 3, 4]).tap(x => tapped.push(x + 1)).toArray();
        
        assert.deepStrictEqual(elements, [1, 2, 3, 4]);
        assert.deepStrictEqual(tapped, [2, 3, 4, 5]);
    });
});