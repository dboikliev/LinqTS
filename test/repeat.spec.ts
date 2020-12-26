import * as assert from 'assert'
import { linq, repeat } from '../src/linq'

describe('repeat', () => {
  describe('instance method', () => {
    it('should repeat the sequence when provided with a posivite value', () => {
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(1).toArray(), [1, 2, 3])
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(3).toArray(), [1, 2, 3, 1, 2, 3, 1, 2, 3])
      assert.deepStrictEqual(linq([]).repeat(3).toArray(), [])
    })

    it('should return an empty sequence when called with a 0', () => {
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(0).toArray(), [])
    })

    it('should repeat the sequence infinitely until stopped when called withouth a count', () => {
      assert.deepStrictEqual(linq([1, 2, 3]).repeat().take(3).toArray(), [1, 2, 3])
      assert.deepStrictEqual(linq([1, 2, 3]).repeat().take(6).toArray(), [1, 2, 3, 1, 2, 3])
    })

    it('should repeat the sequence infinitely until stopped when called with a negative count', () => {
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(-1).take(3).toArray(), [1, 2, 3])
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(-10).take(3).toArray(), [1, 2, 3])
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(-1).take(6).toArray(), [1, 2, 3, 1, 2, 3])
      assert.deepStrictEqual(linq([1, 2, 3]).repeat(-10).take(6).toArray(), [1, 2, 3, 1, 2, 3])
    })
  })

  describe('top-level function', () => {
    it('should repeat an element the specified number of times when called with a positive number', () => {
      assert.deepStrictEqual(repeat('x', 10).toArray(), [...Array(10)].map(() => 'x'))
    })

    it('should return an empty sequence when called with a 0', () => {
      assert.deepStrictEqual(repeat('x', 0).toArray(), [])
    })

    it('should repeat the element infinitely when called without a count', () => {
      assert.deepStrictEqual(repeat('x').take(10).toArray(), [...Array(10)].map(() => 'x'))
      assert.deepStrictEqual(repeat('x').take(100).toArray(), [...Array(100)].map(() => 'x'))
    })

    it('should repeat the element infinitely when called with a negative count', () => {
      assert.deepStrictEqual(repeat('x', -1).take(10).toArray(), [...Array(10)].map(() => 'x'))
      assert.deepStrictEqual(repeat('x', -10).take(10).toArray(), [...Array(10)].map(() => 'x'))
      assert.deepStrictEqual(repeat('x', -1).take(100).toArray(), [...Array(100)].map(() => 'x'))
      assert.deepStrictEqual(repeat('x', -10).take(100).toArray(), [...Array(100)].map(() => 'x'))
    })
  })
})