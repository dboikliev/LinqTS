import * as assert from 'assert'
import { linq } from '../src/linq'

describe('zip', () => {
  it('should pair elements of both sets in the provided order', () => {
    assert.deepStrictEqual(linq([1, 2, 3]).zip(['first', 'second', 'third']).toArray(), [[1, 'first'], [2, 'second'], [3, 'third']])
    assert.deepStrictEqual(linq(['first', 'second', 'third']).zip([1, 2, 3]).toArray(), [['first', 1], ['second', 2], ['third', 3]])
  })

  it('should pair elements of both sets until the short sequence ends', () => {
    assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).zip(['first', 'second', 'third']).toArray(), [[1, 'first'], [2, 'second'], [3, 'third']])
    assert.deepStrictEqual(linq(['first', 'second', 'third']).zip([1, 2, 3, 4, 5]).toArray(), [['first', 1], ['second', 2], ['third', 3]])
    assert.deepStrictEqual(linq([1, 2, 3, 4, 5]).zip([]).toArray(), [])
    assert.deepStrictEqual(linq([]).zip(['first', 'second', 'third']).toArray(), [])
    assert.deepStrictEqual(linq([]).zip([]).toArray(), [])
  })
})