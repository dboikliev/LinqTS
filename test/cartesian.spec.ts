import { expect } from 'chai'
import { linq } from '../src/linq'

describe('cartesian', () => {
  describe('sync', () => {
    it('should return an empty seqeunce when one of the sequences is empty', () => {
      expect(linq([]).cartesian([1, 2, 3, 4]).toArray()).to.be.empty
      expect(linq([1, 2, 3, 4]).cartesian([]).toArray()).to.be.empty
      expect(linq([]).cartesian([]).toArray()).to.be.empty
    })

    describe('preserveOrder = true', () => {
      it('should return the cartesian product of two finite sequences preserving the order', () => {
        const first = [1, 2, 3, 4]
        const second = ['a', 'b', 'c']

        const expected = []
        for (const outer of first) {
          for (const inner of second) {
            expected.push([outer, inner])
          }
        }

        expect(linq(first).cartesian(second).toArray()).to.have.deep.ordered.members(expected)
      })

      it('should return a cartesion product of the first element in the first sequence with elements of the seqeunce when the second is infinite', () => {
        const first = [1, 2, 3, 4]
        function* second() {
          let i = 0
          while (true) {
            yield i++
          }
        }

        const expected = []
        let i = 1
        for (const inner of second()) {
          expected.push([1, inner])
          if (i === 100) {
            break
          }
          i++
        }

        expect(linq(first).cartesian(second()).take(100).toArray()).to.have.deep.ordered.members(expected)
      })
    })
  })
})