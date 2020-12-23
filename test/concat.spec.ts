import * as assert from 'assert'
import { linq, seq } from '../src/linq'

describe('concat', () => {
  it('should append the elements of the provided iterable at the end of the sequence', () => {
    const elements = linq([1, 2, 3, 4])

    assert.deepStrictEqual(linq(elements).concat([5, 6]).toArray(), [1, 2, 3, 4, 5, 6])
    assert.deepStrictEqual(linq(elements).concat(seq(5, 1, 7)).toArray(), [1, 2, 3, 4, 5, 6, 7])
  })

  it('should append nothing when the provided iterable is empty', () => {
    const elements = linq([1, 2, 3, 4])

    assert.deepStrictEqual(linq(elements).concat([]).toArray(), [1, 2, 3, 4])
  })
})