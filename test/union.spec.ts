import { expect } from 'chai'
import { linq } from '../src/linq'
import { objectComparer } from '../src/linq/collections'

describe('union', () => {
  it('should return all unique elements present in both sets', () => {
    expect(linq([1,2,3,4]).union([3,4,5,6]).toArray()).to.have.members([1,2,3,4,5,6])
    expect(linq([1,2,3,4]).union([5,6]).toArray()).to.have.members([1,2,3,4,5,6])
    expect(linq([1,2,3,4]).union([]).toArray()).to.have.members([1,2,3,4])
    expect(linq([]).union([1,2,3,4]).toArray()).to.have.members([1,2,3,4])
    expect(linq([]).union([]).toArray()).to.be.an('array').and.to.be.empty
  })

  it('should return all unique elements present in both sets when provided with an equalityComparer', () => {
    const valuesA = [1,2,3,4].map(x => ({ value: x }))
    const valuesB = [3,4,5,6].map(x => ({ value: x }))

    expect(linq(valuesA).union(valuesB, objectComparer).toArray()).to.have.deep.members([...valuesA, valuesB[2], valuesB[3]])
    expect(linq(valuesA).union([valuesB[2], valuesB[3]], objectComparer).toArray()).to.have.deep.members([...valuesA, valuesB[2], valuesB[3]])
    expect(linq(valuesA).union([], objectComparer).toArray()).to.have.deep.members(valuesA)
    expect(linq([]).union(valuesB, objectComparer).toArray()).to.have.deep.members(valuesB)
    expect(linq([]).union([], objectComparer).toArray()).to.be.an('array').and.to.be.empty
  })
})