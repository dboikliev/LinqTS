import * as assert from 'assert'
import { linq } from '../src/linq'

describe('maxBy', () => {
  it('should return the largest member of the sequence according to the values returned by the selector function', () => {
    assert.deepStrictEqual(linq([{ value: 2 }, { value: -1 }, { value: 3 }]).maxBy(el => el.value), { value: 3 })
    assert.deepStrictEqual(linq([]).maxBy(el => el), undefined)
  })
})