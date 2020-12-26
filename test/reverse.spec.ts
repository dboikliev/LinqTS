import * as assert from 'assert'
import { linq } from '../src/linq'

describe('reverse', () => {
  it('should produce the same sequence in reverse order', () => {
    const reversed = linq([1, 2, 3, 4, 5])
      .reverse()
      .toArray()
        
    assert.deepStrictEqual(reversed, [5, 4, 3, 2, 1])
  })
})