import * as assert from 'assert'
import { linq } from '../src/linq'

describe('distinctBy', () => {
  it('should return a sequence of the unique elements based on equality comparison when a comparer is not provided', () => {
    const elements = linq([1, 1, 2, 3, 3, 3, 4, 4])

    assert.deepStrictEqual(linq(elements).distinct().toArray(), [1, 2, 3, 4])
  })

  it('should return an empty sequence when the provided linqable is empty', () => {
    assert.deepStrictEqual(linq([]).distinct().toArray(), [])
    assert.deepStrictEqual(linq([]).distinct((a, b) => a === b).toArray(), [])
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

    const result = linq(elements).distinct((first, second) => first.logLevel === second.logLevel && first.message === second.message).toArray()
    const expected = [
      { logLevel: 'error', message: 'exception 1' },
      { logLevel: 'error', message: 'exception 2' },
      { logLevel: 'warn', message: 'warning 1' },
      { logLevel: 'warn', message: 'warning 2' }
    ]
    assert.deepStrictEqual(result, expected)
  })
})