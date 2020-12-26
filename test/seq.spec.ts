import * as assert from 'assert'
import { seq } from '../src/linq'

describe('seq', () => {
  it('should generate a sequence from start to end (inclusive) incrementing by the specified step', () => {
    const lowerToHigher = seq(1, 1, 10).toArray()
    assert.deepStrictEqual(lowerToHigher, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

    const higherToLower = seq(5, -1, -5).toArray()
    assert.deepStrictEqual(higherToLower, [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5])
  })

  it('should throw an error when called with a step of 0', () => {
    assert.throws(() => seq(5, 0))
  })

  it('should generate an empty sequence when the start is larger than end and step is positive', () => {
    const sequence = seq(5, 1, 4).toArray()
    assert.deepStrictEqual(sequence, [])
  })

  it('should generate an empty sequence when the start is smaller than end and step is negative', () => {
    const sequence = seq(5, -1, 6).toArray()
    assert.deepStrictEqual(sequence, [])
  })

  it('should generate a sequence of 1 element when start and end are equal', () => {
    const sequence = seq(5, -1, 5).toArray()
    assert.deepStrictEqual(sequence, [5])
  })
})