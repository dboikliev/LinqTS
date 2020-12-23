import * as assert from 'assert'
import { linq } from '../src/linq'

describe('average', () => {
  it('should return the average value of the members in the sequence', () => {
    assert.deepStrictEqual(linq([0, 1]).average(), 0.5)
    assert.deepStrictEqual(linq([1,2,3]).average(), 2)
    assert.deepStrictEqual(linq([]).average(), undefined)
  })
})