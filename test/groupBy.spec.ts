import { expect } from 'chai'
import { id, linq } from '../src/linq'
import { objectComparer } from '../src/linq/collections'

describe('groupBy', () => {
  it('should return an iterable of tuples in the form [key, values-in-group[]]', () => {
    const elements = [{ author: 'Ivan', book: 'First'}, { author: 'Ivan', book: 'Second' }, { author: 'John', book: 'Third' }]
        
    const result = linq(elements).groupBy(el => el.author).toArray()
    expect(result).to.have.deep.members([[elements[0].author, [elements[0], elements[1]]], [elements[2].author, [elements[2]]]])
  })

  it('should return an empty sequence when the applied on an empty linqable', () => {
    const elements = []
        
    const result = linq(elements).groupBy(el => el.author).toArray()
    expect(result).to.be.an('array').that.is.empty
  })

  it('should group objects based on the equalityComparer when one is provided', () => {
    const elements = [{ author: 'Ivan', book: 'First'}, { author: 'Ivan', book: 'First' }, { author: 'John', book: 'Third' }]
        
    const result = linq(elements).groupBy(el => el).toArray()
    expect(result).to.have.deep.members(elements.map(el => [el, [el]]))

    const resultComparer = linq(elements).groupBy(id, objectComparer).toArray()
    expect(resultComparer).to.have.deep.members([[elements[0], [elements[0], elements[1]]], [elements[2], [elements[2]]]])
  })
})