import * as assert from 'assert'
import { linq } from '../src/linq'

describe('ordering', () => {
  describe('orderBy', () => {
    it('should order numbers by value in ascending order', () => {
      const sorted = linq([1, 2, 1000, 3, 4, 5])
        .orderBy(x => x)
        .toArray()
        
      assert.deepEqual(sorted, [1, 2, 3, 4, 5, 1000])
    })

    it('should order strings lexicographically in ascending order', () => {
      const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
        .orderBy(x => x)
        .toArray()
        
      assert.deepEqual(sorted, ['aa', 'ab', 'ba', 'c', 'ccc', 'd'])
    })
  })

  describe('orderByDescending tests', () => {
    it('should order numbers by value in descending order', () => {
      const sorted = linq([1000, 1, 2, 3, 4, 5])
        .orderByDescending(x => x)
        .toArray()
            
      assert.deepEqual(sorted, [1000, 5, 4, 3, 2, 1])
    })

    it('should order strings lexicographically in descending order', () => {
      const sorted = linq(['c', 'ab', 'ccc', 'aa', 'd', 'ba'])
        .orderByDescending(x => x)
        .toArray()
        
      assert.deepEqual(sorted, ['d', 'ccc', 'c', 'ba', 'ab', 'aa'])
    })
  })

  describe('thenBy', () => {
    it('should add additional criteria for sorting in ascending order', () => {
      const sorted = linq([-3, -2, -1, 0, 1, 2, 3, 4])
        .orderBy(x => x == 0 ? 1 : Math.sign(x))
        .thenBy(Math.abs)
        .toArray()
            
      assert.deepEqual(sorted, [-1, -2, -3, 0, 1, 2, 3, 4])
    })
  })

  describe('thenByDescending', () => {
    it('should add additional criteria for sorting in descneding order', () => {
      const sorted = linq([-3, -2, -1, 0, 1, 2, 3, 4])
        .orderBy(x => x == 0 ? 1 : Math.sign(x))
        .thenByDescending(Math.abs)
        .toArray()
            
      assert.deepEqual(sorted, [-3, -2, -1, 4, 3, 2, 1, 0])
    })
  })
})