import * as assert from 'assert'
import { linq } from '../src/linq'

describe('toMap', () => {
  it('should convert the linqble to a map where the values are the elements when a value selector is not provided', () => {
    const elements = [1, 2, 3, 4, 5]
    const map = linq(elements).toMap(x => x)

    assert.deepStrictEqual(map, elements.reduce((map, el) => map.set(el, el), new Map()))
  })

  it('should convert the linqble to a map and use the value selector is when provided', () => {
    const elements = [1, 2, 3, 4, 5]
    const map = linq(elements).toMap(x => x, x => x * 10)

    assert.deepStrictEqual(map, elements.reduce((map, el) => map.set(el, el * 10), new Map()))
  })

  it('should throw an error when there the same key is provided multiple times', () => {
    const elements = [1, 2, 2, 3, 4, 4, 5]

    assert.throws(() => linq(elements).toMap(x => x), 'An element with the key "1" has already been added.')
  })
})