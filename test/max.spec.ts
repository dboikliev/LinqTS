import * as assert from 'assert'
import { linq } from '../src/linq'

describe('max', () => {
  it('should return the largest member of the sequence', () => {
    assert.deepStrictEqual(linq([-3, 2, 1, 10]).max(), 10)
    assert.deepStrictEqual(linq(['dd', 'd', 'a', 'qq', 'qqq']).max(), 'qqq')
    assert.deepStrictEqual(linq([]).max(), undefined)
  })
})