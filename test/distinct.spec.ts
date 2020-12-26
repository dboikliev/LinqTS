import * as assert from 'assert'
import { linq } from '../src/linq'
import { numberComparer, stringComparer } from '../src/linq/collections/comparers'

describe('distinctBy', () => {
  it('should return a sequence of the unique elements based on equality comparison when a comparer is not provided', () => {
    const elements = linq([1, 1, 2, 3, 3, 3, 4, 4])

    assert.deepStrictEqual(linq(elements).distinct().toArray(), [1, 2, 3, 4])
  })

  it('should return an empty sequence when the provided linqable is empty', () => {
    assert.deepStrictEqual(linq([]).distinct().toArray(), [])
    assert.deepStrictEqual(linq([]).distinct(numberComparer).toArray(), [])
  })

  it('should return a sequence of unique elements based on the provided comparer function', () => {
    const elements = [
      { logLevel: 'error', message: 'exception 1' },
      { logLevel: 'error', message: 'exception 1' },
      { logLevel: 'error', message: 'exception 2' },
      { logLevel: 'warn', message: 'warning 1' },
      { logLevel: 'warn', message: 'warning 1' },
      { logLevel: 'warn', message: 'warning 2' }
    ]

    const comparer = { 
      hash: el => stringComparer.hash(el.logLevel) * 31 + stringComparer.hash(el.message), 
      equals: (first, second) => first.logLevel === second.logLevel && first.message === second.message 
    }

    const result = linq(elements).distinct(comparer).toArray()
    const expected = [
      { logLevel: 'error', message: 'exception 1' },
      { logLevel: 'error', message: 'exception 2' },
      { logLevel: 'warn', message: 'warning 1' },
      { logLevel: 'warn', message: 'warning 2' }
    ]
    assert.equal(expected.length, expected.length)
    for (let i = 0; i < result.length; i++) {
      assert.equal(result.some(el => comparer.equals(el, expected[i])), true)
    }
  })
})