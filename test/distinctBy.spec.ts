import * as assert from "assert";
import { linq } from "../src/linq";

describe("distinctBy", () => {
    it("should return an empty sequence when the provided linqable is empty", () => {
        const elements = linq([])

        assert.deepStrictEqual(linq(elements).distinctBy(x => x).toArray(), []);
    });

    it("should return a sequence of unique elements based on the projected key", () => {
        assert.deepStrictEqual(linq(["a", "b", "cc", "qwe", "asd"]).distinctBy(el => el.length).toArray(), ["a", "cc", "qwe"])

        assert.deepStrictEqual(linq([1, 1, 2, 3, 3, 3, 4, 4]).distinctBy(x => x).toArray(), [1, 2, 3, 4]);
    });
});