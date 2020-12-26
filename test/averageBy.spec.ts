import * as assert from 'assert'
import { linq } from '../src/linq'

describe('averageBy', () => {
  it('should return the average value the values returned by the selector function', () => {
    assert.deepStrictEqual(linq([{ value: 2 }, { value: 1 }, { value: 3 }]).averageBy(el => el.value), 2)
    assert.deepStrictEqual(linq([]).averageBy(el => el), undefined)
  })
})