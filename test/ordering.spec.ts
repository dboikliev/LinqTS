import * as assert from "assert";
import { linq } from "../src/linq";

describe("ordering tests", () => {
    describe("orderBy tests", () => {
        it("[5, 4, 3, 2, 1] should be sorted in ascending order", () => {
            const sorted = linq([5, 4, 3, 2, 1])
                .orderBy(x => x)
                .toArray();
            
            assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in ascending order")
        });

        it("[1, 2, 3, 4, 5] should remain sorted in ascending order", () => {
            const sorted = linq([1, 2, 3, 4, 5])
                .orderBy(x => x)
                .toArray();
        
            assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in ascending order");
        });

        it("['c', 'ab', 'ccc', 'aa', 'd', 'ba'] should be sorted lexicographically in ascending order", () => {
            const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
                .orderBy(x => x)
                .toArray();
        
            assert.deepEqual(sorted, ['aa', 'ab', 'ba', 'c', 'ccc', 'd'], "elements in ascending order");
        });
    });

    describe("orderByDescending tests", () => {
        it("[1, 2, 3, 4, 5] should be sorted in descending order", () => {
            const sorted = linq([1, 2, 3, 4, 5])
                .orderByDescending(x => x)
                .toArray();
            
            assert.deepEqual(sorted, [5, 4, 3, 2, 1], "elements in descending order")
        });

        it("[5, 4, 3, 2, 1] should remain sorted in ascending order", () => {
            const sorted = linq([5, 4, 3, 2, 1])
                .orderByDescending(x => x)
                .toArray();
        
            assert.deepEqual(sorted, [5, 4, 3, 2, 1], "elements in descending order");
        });

        it("['c', 'ab', 'ccc', 'aa', 'd', 'ba'] should be sorted lexicographically in descending order", () => {
            const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
                .orderByDescending(x => x)
                .toArray();
        
            assert.deepEqual(sorted, ['d', 'ccc', 'c', 'ba', 'ab', 'aa'], "elements in descending order");
        });
    })
});