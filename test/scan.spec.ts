import * as assert from 'assert'
import { linq } from '../src/linq'

describe('append', () => {
  it('should initially pass the first two elements then yield the intermediate values when called without seed', () => {
    assert.deepStrictEqual(linq([]).scan((acc, c) => acc + c).toArray(), [])
    assert.deepStrictEqual(linq([1]).scan((acc, c) => 1000).toArray(), [1])
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