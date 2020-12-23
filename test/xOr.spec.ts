import * as assert from 'assert'
import { linq } from '../src/linq'

describe('xOr', () => {
  it('should return the symmetric difference of both sets', () => {
    assert.deepStrictEqual(linq([1, 2, 3, 4]).xOr([3, 4, 5, 6]).toArray(), [1, 2, 5, 6])
    assert.deepStrictEqual(linq([1, 2, 3, 4]).xOr([5, 6]).toArray(), [1, 2, 3, 4, 5, 6])
    assert.deepStrictEqual(linq([1, 2, 3, 4]).xOr([]).toArray(), [1, 2, 3, 4])
    assert.deepStrictEqual(linq([]).xOr([]).toArray(), [])
  })
})