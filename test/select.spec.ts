import * as assert from "assert";
import { linq } from "../src/linq";

describe("select", () => {
    it("should return the elements transformed by the provided function", () => {
        const elements = [1, 2, 3, 4];

        assert.deepStrictEqual(linq(elements).select(x => x ** 2).toArray(), elements.map(x => x ** 2));
    });
});