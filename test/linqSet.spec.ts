import { assert, expect } from 'chai'
import { LinqSet, numberComparer } from '../src/linq/collections'

describe('LinqSet', () => {
  describe('size', () => {
    it('should have an initial size of 0', () => {
      const set = new LinqSet()
      expect(set.size).to.equal(0)
    })

    it('should should grow the size when an element is set', () => {
      const set = new LinqSet()
      for (let i = 0; i < 100; i++) {
        set.add(i)
        expect(set.size).to.equal(i + 1)
      }
    })

    it('should should shrink size when an element is deleted', () => {
      const set = new LinqSet()
      for (let i = 0; i < 100; i++) {
        set.add(i)
      }
  
      for (let i = 0; i < 100; i++) {
        set.delete(i)
        assert.equal(set.size, 99 - i)
      }
    })
  })

  describe('delete', () => {
    it('should return true if the key exists in the map', () => {
      const set = new LinqSet(numberComparer)
      set.add(1)
      set.add(2)

      expect(set.delete(1)).to.be.true
      expect(set.delete(1)).to.be.false
      expect(set.delete(2)).to.be.true
      expect(set.delete(2)).to.be.false
    })
  })

  describe('has', () => {
    it('should return true if the key exists in the map', () => {
      const set = new LinqSet()
      for (let i = 0; i < 100; i++) {
        set.add(i)
      }

      for (let i = 0; i < 100; i++) {
        expect(set.has(i)).to.be.true
      }

      expect(set.has(-1)).to.be.false
      expect(set.has(100)).to.be.false
    })
  })
})