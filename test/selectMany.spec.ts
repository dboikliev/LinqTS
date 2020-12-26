import * as assert from 'assert'
import { linq } from '../src/linq'

describe('selectMany', () => {
  it('should return a flat sequence of the elements returned in the selector function', () => {
    const elements = [{ numbers: [1, 2, 3, 4] }, { numbers: [5, 6, 7, 8, 9] }]

    assert.deepStrictEqual(linq(elements).selectMany(el => el.numbers).toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})