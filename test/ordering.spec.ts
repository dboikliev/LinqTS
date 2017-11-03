import * as assert from "assert";
import { linq } from "../src/linq";

describe("orderBy tests", () => {
    it("[5, 4, 3, 2, 1] should be sorted in asending order", () => {
        const sorted = linq([5, 4, 3, 2, 1])
            .orderBy(x => x)
            .toArray();
        
        assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in asending order")
    });

    it("[1, 2, 3, 4, 5] should remain sorted in ascending order", () => {
        const sorted = linq([1, 2, 3, 4, 5])
            .orderBy(x => x)
            .toArray();
    
        assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in asending order");
    });

    it("['c', 'ab', 'ccc', 'aa', 'd', 'ba'] should be sorted lexicographically", () => {
        const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
            .orderBy(x => x)
            .toArray();
    
        assert.deepEqual(sorted, ['aa', 'ab', 'ba', 'c', 'ccc', 'd'], "elements in asending order");
    });
});