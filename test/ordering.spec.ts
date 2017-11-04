import * as assert from "assert"
import { linq } from "../src/linq"

describe("ordering tests", () => {
    describe("orderBy tests", () => {
        it("shoudl sort [5, 4, 3, 2, 1] in ascending order", () => {
            const sorted = linq([5, 4, 3, 2, 1])
                .orderBy(x => x)
                .toArray()
            
            assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in ascending order")
        })

        it("should keep [1, 2, 3, 4, 5] sorted in ascending order", () => {
            const sorted = linq([1, 2, 3, 4, 5])
                .orderBy(x => x)
                .toArray()
        
            assert.deepEqual(sorted, [1, 2, 3, 4, 5], "elements in ascending order")
        })

        it("should sort ['c', 'ab', 'ccc', 'aa', 'd', 'ba'] lexicographically in ascending order", () => {
            const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
                .orderBy(x => x)
                .toArray()
        
            assert.deepEqual(sorted, ['aa', 'ab', 'ba', 'c', 'ccc', 'd'], "elements in ascending order")
        })

        it("should order [5, 5, 1, 2, 8, -1, 2, -2, 1, 8, 0] in ascending order", () => {
            const sorted = linq([5, 5, 1, 2, 8, -1, 2, -2, 1, 8, 0]).orderBy(x => x).toArray()

            assert.deepStrictEqual(sorted, [-2, -1, 0, 1, 1, 2, 2, 5, 5, 8, 8])
        })
    })

    describe("orderByDescending tests", () => {
        it("should sort [1, 2, 3, 4, 5] in descending order", () => {
            const sorted = linq([1, 2, 3, 4, 5])
                .orderByDescending(x => x)
                .toArray()
            
            assert.deepEqual(sorted, [5, 4, 3, 2, 1], "elements in descending order")
        })

        it("should keep [5, 4, 3, 2, 1] in descneding order", () => {
            const sorted = linq([5, 4, 3, 2, 1])
                .orderByDescending(x => x)
                .toArray()
        
            assert.deepEqual(sorted, [5, 4, 3, 2, 1], "elements in descending order")
        })

        it("should sort ['c', 'ab', 'ccc', 'aa', 'd', 'ba'] lexicographically in descending order", () => {
            const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
                .orderByDescending(x => x)
                .toArray()
        
            assert.deepEqual(sorted, ['d', 'ccc', 'c', 'ba', 'ab', 'aa'], "elements in descending order")
        })
    })

    describe("thenBy tests", () => {
        it("should sort [-3, -2, -1, 0, 1, 2, 3, 4] first by sign then by absolute value in ascending order", () => {
            const sorted = linq([-3, -2, -1, 0, 1, 2, 3, 4])
                .orderBy(x => x == 0 ? 1 : Math.sign(x))
                .thenBy(Math.abs)
                .toArray()
            
            assert.deepEqual(sorted, [-1, -2, -3, 0, 1, 2, 3, 4], "elements in ascending order")
        })
    })

    describe("thenByDescending tests", () => {
        it("should sort [-3, -2, -1, 0, 1, 2, 3, 4] first by sign then by absolute value in descneding order", () => {
            const sorted = linq([-3, -2, -1, 0, 1, 2, 3, 4])
                .orderBy(x => x == 0 ? 1 : Math.sign(x))
                .thenByDescending(Math.abs)
                .toArray()
            
            assert.deepEqual(sorted, [-3, -2, -1, 4, 3, 2, 1, 0], "elements in descending order")
        })
    })
})