import * as assert from 'assert'
import { linq } from '../src/linq'

describe('toMapMany', () => {
  it('should convert the linqble to a map where the values are the elements when a value selector is not provided', () => {
    const elements = [1, 2, 3, 4, 5]
    const map = linq(elements).toMapMany(x => x)

    assert.deepStrictEqual(map, elements.reduce((map, el) => map.set(el, [el]), new Map()))
  })

  it('should convert the linqble to a map and use the value selector is when provided', () => {
    const elements = [1, 2, 3, 4, 5]
    const map = linq(elements).toMapMany(x => x, x => x * 10)

    assert.deepStrictEqual(map, elements.reduce((map, el) => map.set(el, [el * 10]), new Map()))
  })

  it('should aggregate elements with the same key into their respective arrays', () => {
    const elements = [1, 2, 2, 3, 4, 4, 5]
    const map = linq(elements).toMapMany(x => x, x => x * 10)
    const expected = elements.reduce((map, el) => {
      const values = map.get(el) || []
      values.push(el * 10)
      return map.set(el, values)
    }, new Map())
    assert.deepStrictEqual(map, expected)
  })
})