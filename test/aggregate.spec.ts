import * as assert from 'assert'
import { linq, linqAsync } from '../src/linq'

describe('aggregate', () => {
  describe('sync', () => {
    it('should initially pass the first two elements then yield the intermediate values when called without seed', () => {
      assert.deepStrictEqual(linq([]).aggregate((acc, c) => acc + c), undefined)
      assert.deepStrictEqual(linq([1]).aggregate((acc, c) => acc + c), 1)
      assert.deepStrictEqual(linq([1, 2]).aggregate((acc, c) => acc + c), 3)
      assert.deepStrictEqual(linq([1, 2, 3, 4]).aggregate((acc, c) => acc + c), 10)
      assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).aggregate((acc, c) => acc + c), 15)
    })

    it('should return undefiend when called on an empty linqable without seed', () => {
      assert.deepStrictEqual(linq([]).aggregate((acc, c) => acc + c), undefined)
    })

    it('should initially pass the seed and the first element then yield the intermediate values when called with seed', () => {
      assert.deepStrictEqual(linq([1]).aggregate((acc, c) => acc + c, 11), 12)
      assert.deepStrictEqual(linq([1, 2]).aggregate((acc, c) => acc + c, 10), 13)
      assert.deepStrictEqual(linq([1, 2, 3, 4]).aggregate((acc, c) => acc + c, 10), 20)
      assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).aggregate((acc, c) => acc + c, 10), 25)
    })

    it('should return the seed when called on an empty linqable', () => {
      assert.deepStrictEqual(linq([]).aggregate((acc, c) => acc + c, 10), 10)
    })

    it('should should pass 0 as inital index when a seed is provided ', () => {
      let indices = []
      linq([1, 2, 3]).aggregate((acc, c, index) => {
        indices.push(index)
        return acc + c
      }, 10)

      assert.deepStrictEqual(indices, [0, 1, 2])
    })

    it('should should pass 1 as inital index when a seed not provided ', () => {
      let indices = []
      linq([1, 2, 3]).aggregate((acc, c, index) => {
        indices.push(index)
        return acc + c
      })

      assert.deepStrictEqual(indices, [1, 2])
    })
  })

  describe('async', () => {
    it('should initially pass the first two elements then yield the intermediate values when called without seed', async () => {
      assert.deepStrictEqual(await linqAsync([]).aggregate((acc, c) => acc + c), undefined)
      assert.deepStrictEqual(await linqAsync([1]).aggregate((acc, c) => acc + c), 1)
      assert.deepStrictEqual(await linqAsync([1, 2]).aggregate((acc, c) => acc + c), 3)
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).aggregate((acc, c) => acc + c), 10)
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4, 5]).aggregate((acc, c) => acc + c), 15)
    })

    it('should return undefiend when called on an empty linqable without seed', async () => {
      assert.deepStrictEqual(await linqAsync([]).aggregate((acc, c) => acc + c), undefined)
    })

    it('should initially pass the seed and the first element then yield the intermediate values when called with seed', async () => {
      assert.deepStrictEqual(await linqAsync([1]).aggregate((acc, c) => acc + c, 11), 12)
      assert.deepStrictEqual(await linqAsync([1, 2]).aggregate((acc, c) => acc + c, 10), 13)
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).aggregate((acc, c) => acc + c, 10), 20)
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4, 5]).aggregate((acc, c) => acc + c, 10), 25)
    }) 

    it('should return the seed when called on an empty linqable', async () => {
      assert.deepStrictEqual(await linqAsync([]).aggregate((acc, c) => acc + c, 10), 10)
    }) 

    it('should accept async accumulator functions', async () => {
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).aggregate(async (acc, c) => {
        await delay(1)
        return acc + c
      }), 10)
      assert.deepStrictEqual(await linqAsync([1, 2, 3, 4]).aggregate(async (acc, c) => {
        await delay(1)
        return acc + c
      }, 10), 20)
    })

    it('should should pass 0 as inital index when a seed is provided ', () => {
      let indices = []
      linq([1, 2, 3]).aggregate((acc, c, index) => {
        indices.push(index)
        return acc + c
      }, 10)

      assert.deepStrictEqual(indices, [0, 1, 2])
    })

    it('should should pass 1 as inital index when a seed not provided ', async () => {
      let indices = []
      await linqAsync([1, 2, 3]).aggregate(async (acc, c, index) => {
        await delay(1)
        indices.push(index)
        return acc + c
      })

      assert.deepStrictEqual(indices, [1, 2])
    })

    function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  })
})