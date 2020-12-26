import * as assert from 'assert'
import { linq } from '../src/linq'

describe('maxBy', () => {
  it('should return the smallest member of the sequence according to the values returned by the selector function', () => {
    assert.deepStrictEqual(linq([{ value: 2}, {value: -1}, { value: 3}]).minBy(el => el.value), { value: - 1})
    assert.deepStrictEqual(linq([]).minBy(el => el), undefined)
  })
})