import * as assert from 'assert'
import { linq, linqAsync } from '../src/linq'

describe('scan', () => {
  describe('sync', () => {
    it('should initially pass the first two elements then yield the intermediate values when called without seed', () => {
      assert.deepStrictEqual(linq([]).scan((acc, c) => acc + c).toArray(), [])
      assert.deepStrictEqual(linq([1]).scan(() => 1000).toArray(), [1])
      assert.deepStrictEqual(linq([1, 2, 3, 4]).scan((acc, c) => acc + c).toArray(), [1, 3, 6, 10])
      assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).scan((acc, c) => acc + c).toArray(), [1, 3, 6, 10, 15])
    })

    it('should initially pass the seed and the first element then yield the intermediate values when called with seed', () => {
      assert.deepStrictEqual(linq([]).scan((acc, c) => acc + c, 10).toArray(), [])
      assert.deepStrictEqual(linq([1]).scan((acc, c) => acc + c, 11).toArray(), [12])
      assert.deepStrictEqual(linq([1, 2, 3, 4]).scan((acc, c) => acc + c, 10).toArray(), [11, 13, 16, 20])
      assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).scan((acc, c) => acc + c, 10).toArray(), [11, 13, 16, 20, 25])
    })
  })

  describe('async', () => {
    it('should initially pass the first two elements then yield the intermediate values when called without seed', async () => {
      assert.deepStrictEqual(await linqAsync([]).scan((acc, c) => acc + c).toArray(), [])
      assert.deepStrictEqual(await linqAsync([1]).scan(() => 1000).toArray(), [1])
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).scan((acc, c) => acc + c).toArray(), [1, 3, 6, 10])
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4, 5]).scan((acc, c) => acc + c).toArray(), [1, 3, 6, 10, 15])
    })

    it('should initially pass the seed and the first element then yield the intermediate values when called with seed', async () => {
      assert.deepStrictEqual(await linqAsync([]).scan((acc, c) => acc + c, 10).toArray(), [])
      assert.deepStrictEqual(await linqAsync([1]).scan((acc, c) => acc + c, 11).toArray(), [12])
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).scan((acc, c) => acc + c, 10).toArray(), [11, 13, 16, 20])
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4, 5]).scan((acc, c) => acc + c, 10).toArray(), [11, 13, 16, 20, 25])
    })

    it('should accept async accumulator functions', async () => {
      function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
      }

      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).scan(async (acc, c) => {
        await delay(1)
        return acc + c
      }).toArray(), [1, 3, 6, 10])
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).scan(async (acc, c) => {
        await delay(1)
        return acc + c
      }, 10).toArray(), [11, 13, 16, 20])
    })
  })
})