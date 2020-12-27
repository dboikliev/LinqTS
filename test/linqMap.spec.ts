import { assert, expect } from 'chai'
import { LinqMap, numberComparer } from '../src/linq/collections'

describe('LinqMap', () => {
  describe('capacity', () => {
    it('should be a positive integer', () => {
      expect(() => new LinqMap(numberComparer, 0)).to.throw(Error, 'capacity must be a positive integer.') 
      expect(() => new LinqMap(numberComparer, -1)).to.throw(Error, 'capacity must be a positive integer.')
      expect(() => new LinqMap(numberComparer, -100)).to.throw(Error, 'capacity must be a positive integer.')
      expect(() => new LinqMap(numberComparer, -3.5)).to.throw(Error, 'capacity must be a positive integer.')
      expect(() => new LinqMap(numberComparer, 3.5)).to.throw(Error, 'capacity must be a positive integer.')
    })

    it('should have an initial value of 2', () => {
      const map = new LinqMap()
      expect(map.capacity).to.equal(2)
    })

    it('should increase by a factor of 2 when elements are added', () => {
      const map = new LinqMap()
      const total = 1000
      let prevCapacity = map.capacity
      for (let i = 0; i < total; i++) {
        map.set(i, i)
        expect(map.capacity).to.be.above(map.size)
        if (map.capacity != prevCapacity) {
          expect(map.capacity).to.equal(prevCapacity * 2)
          prevCapacity = map.capacity
        }
      }
    })

    it('should be preserved after subsequent sets and deletes', () => {
      const map = new LinqMap()
      const total = 100
      for (let i = 0; i < total; i++) {
        map.set(i, i)
      }
      const capacity = map.capacity
  
      for (let j = 0; j < 10; j++) {
        for (let i = 0; i < total; i++) {
          map.delete(i)
          expect(map.capacity).to.equal(capacity)
        }
  
        for (let i = 0; i < total; i++) {
          map.set(i, i)
          expect(map.capacity).to.equal(capacity)
        }
      }
    })
  })
  
  describe('size', () => {
    it('should have an initial size of 0', () => {
      const map = new LinqMap()
      expect(map.size).to.equal(0)
    })

    it('should should grow the size when an element is set', () => {
      const map = new LinqMap()
      for (let i = 0; i < 100; i++) {
        map.set(i, i)
        expect(map.size).to.equal(i + 1)
      }
    })

    it('should should shrink size when an element is deleted', () => {
      const map = new LinqMap()
      for (let i = 0; i < 100; i++) {
        map.set(i, i)
      }
  
      for (let i = 0; i < 100; i++) {
        map.delete(i)
        assert.equal(map.size, 99 - i)
      }
    })
  })

  describe('delete', () => {
    it('should return true if the key exists in the map', () => {
      const map = new LinqMap(numberComparer)
      map.set(1, 'a')
      map.set(2, 'b')

      expect(map.delete(1)).to.be.true
      expect(map.delete(1)).to.be.false
      expect(map.delete(2)).to.be.true
      expect(map.delete(2)).to.be.false
    })
  })

  describe('has', () => {
    it('should return true if the key exists in the map', () => {
      const map = new LinqMap()
      for (let i = 0; i < 100; i++) {
        map.set(i, i.toString())
      }

      for (let i = 0; i < 100; i++) {
        expect(map.has(i)).to.be.true
      }

      expect(map.has(-1)).to.be.false
      expect(map.has(100)).to.be.false
    })
  })

  describe('get', () => {
    it('should return the value if the key exists in the map', () => {
      const map = new LinqMap()
      for (let i = 0; i < 100; i++) {
        map.set(i, i.toString())
      }

      for (let i = 0; i < 100; i++) {
        expect(map.get(i)).to.equal(i.toString())
      }

      expect(map.get(-1)).to.be.undefined
      expect(map.get(100)).to.be.undefined
    })

    it('should return undefined if the key was deleted', () => {
      const map = new LinqMap()
      map.set(1, 'a')

      expect(map.get(1)).to.equal('a')
      map.delete(1)
      expect(map.get(1)).to.be.undefined
    })

    it('should find elements with collisions after a delete', () => {
      // force collisions with hash = 0
      const map = new LinqMap<number, number>({ hash: () => 0, equals: (a, b) => a === b})
      for (let i = 0; i < 1000; i++) {
        map.set(i, 1)
      }

      let total = 0
      for (let i = 0; i < 1000; i++) {
        total += map.get(i)
      }

      expect(total).to.equal(1000)

      map.delete(0)
      map.delete(50)
      map.delete(600)

      total = 0
      for (let i = 0; i < 1000; i++) {
        total += map.get(i) || 0
      }

      expect(total).to.equal(997)
    })
  })
})