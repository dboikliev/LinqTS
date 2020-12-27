import { expect } from 'chai'
import { linq } from '../src/linq'
import { LinqSet, numberComparer } from '../src/linq/collections'

describe('toSet', () => {
  it('should return a set of the elements in the sequence', () => {
    const elements = [1, 2, 3, 3, 3, 4, 5, 5]
    const set = linq(elements).toSet()

    expect(set)
      .to.be.instanceOf(Set)
      .and.to.deep.equal(elements.reduce((map, el) => map.add(el), new Set()))
  })

  it('should return a set of the elements in the sequence using the equalityComparer when provided', () => {
    const elements = [1, 2, 3, 3, 3, 4, 5, 5].map(el => ({ value: el }))
    const comparer = { hash: el => numberComparer.hash(el.value), equals: (a, b) => a.value === b.value }
    const set = linq(elements).toSet(comparer)

    expect(set).to.be.instanceOf(LinqSet)
    expect(Array.from(set.values())).to.have.deep.members([1, 2, 3, 4, 5].map(el => ({ value: el })))
  })
})