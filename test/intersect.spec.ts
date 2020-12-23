import * as assert from 'assert'
import { linq } from '../src/linq'

describe('intersect', () => {
  it('should return all elements of the linqable that are in the provided set', () => {
    assert.deepStrictEqual(linq([1,2,3,4]).intersect([3,4,5,6]).toArray(), [3,4])
    assert.deepStrictEqual(linq([1,2,3,4]).intersect([5,6]).toArray(), [])
    assert.deepStrictEqual(linq([1,2,3,4]).intersect([]).toArray(), [])
    assert.deepStrictEqual(linq([]).intersect([1,2,3,4]).toArray(), [])
  })
})