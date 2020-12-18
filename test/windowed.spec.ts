import * as assert from "assert";
import { linq } from "../src/linq";

describe("windowed", () => {
    it("should return a sliding window of the specified size", () => {
        const elements = [1, 2, 3, 4, 5, 6];

        let windows = linq(elements).windowed(1);
        assert.deepStrictEqual(windows.toArray(), elements.map(el => [el]));

        windows = linq(elements).windowed(2);
        assert.deepStrictEqual(windows.toArray(), [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]);

        windows = linq(elements).windowed(5);
        assert.deepStrictEqual(windows.toArray(), [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]]);

        windows = linq(elements).windowed(elements.length);
        assert.deepStrictEqual(windows.toArray(), [[1, 2, 3, 4, 5, 6]]);

        windows = linq(elements).windowed(10);
        assert.deepStrictEqual(windows.toArray(), [[1, 2, 3, 4, 5, 6]]);

    });

    it("should return an empty window when size <= 0", () => {
        const elements = [1, 2, 3, 4, 5, 6];
       
        let windows = linq(elements).windowed(0);
        assert.deepStrictEqual(windows.toArray(), []);

        windows = linq(elements).windowed(-5);
        assert.deepStrictEqual(windows.toArray(), []);

        windows = linq(elements).windowed(0, 0);
        assert.deepStrictEqual(windows.toArray(), []);

        windows = linq(elements).windowed(0, 1);
        assert.deepStrictEqual(windows.toArray(), []);

        windows = linq(elements).windowed(-1, 0);
        assert.deepStrictEqual(windows.toArray(), []);

        windows = linq(elements).windowed(-1, -1);
        assert.deepStrictEqual(windows.toArray(), []);
    });

    it("should return a sliding window of the specified size and skipping the specified count of elements", () => {
        const elements = [1, 2, 3, 4, 5, 6];

        let windows = linq(elements).windowed(1, 1);
        assert.deepStrictEqual(windows.toArray(), elements.map(el => [el]));

        windows = linq(elements).windowed(2, 2);
        assert.deepStrictEqual(windows.toArray(), [[1, 2], [3, 4], [5, 6]]);

        windows = linq(elements).windowed(2, 3);
        assert.deepStrictEqual(windows.toArray(), [[1, 2], [4, 5]]);

        windows = linq(elements).windowed(2, 10);
        assert.deepStrictEqual(windows.toArray(), [[1, 2]]);

    });

    it("should throw an error when provided size > 0 and step === 0", () => {
        assert.throws(() => linq([1,2,3]).windowed(1, 0));
        assert.throws(() => linq([1,2,3]).windowed(1, -1));
    });
});