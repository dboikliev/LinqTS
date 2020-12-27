import {
  Concat,
  Distinct,
  DistinctBy,
  Except,
  GroupBy,
  Intersect,
  Join,
  Ordered,
  Reverse,
  Select,
  SelectMany,
  Skip,
  SkipWhile,
  Take,
  TakeWhile,
  Union,
  Where,
  Windowed,
  Zip,
  Tap,
  Repeat,
  Grouping
} from './iterables'
import { elementsSymbol, ElementsWrapper, isWrapper } from './element-wrapper'
import { id } from '.'
import { EqualityComparer } from './collections/comparers'

export class Linqable<TSource> implements Iterable<TSource>, ElementsWrapper<TSource> {
  constructor(protected elements: Iterable<TSource>) {
  }

  *[Symbol.iterator](): IterableIterator<TSource> {
    yield* this.elements
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource>> {
    yield this.elements
  }

  /**
     * Checks if any of the elements match the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
  any(predicate?: (element: TSource) => boolean): boolean {
    if (predicate) {
      for (const value of this) {
        if (predicate(value)) {
          return true
        }
      }
    } else {
      const iter = this[Symbol.iterator]()
      return !iter.next().done
    }

    return false
  }

  /**
     * Checks if all of the elements match the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
  all(predicate: (element: TSource) => boolean): boolean {
    for (const value of this) {
      if (!predicate(value)) {
        return false
      }
    }
    return true
  }

  /**
     * Performs a join on objects matching property values according to the provided leftSelector and rightSelector.
     * The matching objects are merged into another value by resultSelector.
     * @param {Iterable<TRight>} right - The collection being to which the join is performed
     * @param {function} leftSelector - A property selector for objects from the left collection
     * @param {function} rightSelector - A property selector for objects from the right collection
     * @param {function} resultSelector - A function merging the matching objects into a result
     * @returns {Linqable<TResult>} An iterable of values produced by resultSelector
     */
  join<TRight, TResult>(right: Iterable<TRight>,
    leftSelector: (element: TSource) => unknown,
    rightSelector: (element: TRight) => unknown,
    resultSelector: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
    return new Linqable(new Join(this.elements,
      unwrap(right),
      leftSelector,
      rightSelector,
      resultSelector
    ))
  }

  /**
     * Skips a specific number of elements.
     * @param {number} count - The number of elements to skip.
     * @returns {Linqable<TSource>} An iterable with a beginning after the skipped values.
     */
  skip(count: number): Linqable<TSource> {
    return new Linqable(new Skip(this.elements, count))
  }

  /**
     * Skips elements while they satisfy the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {Linqable<TSource>} An iterable with a beginning after the skipped values.
     */
  skipWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
    return new Linqable(new SkipWhile(this.elements, predicate))
  }

  /**
   * Skips elements until some element satisfies the provided predicate.
   * @param {function} predicate - A predicate which the elements will be checked against.
   * @returns {Linqable<TSource>} An iterable with a beginning after the skipped values.
   */
  skipUntil(predicate: (element: TSource) => boolean): Linqable<TSource> {
    return new Linqable(new SkipWhile(this.elements, el => !predicate(el)))
  }

  /**
     * Takes a specific number of elements.
     * @param {number} count - The number of elements to take.
     * @returns {Linqable<TSource>} An iterable for the taken elements.
     */
  take(count: number): Linqable<TSource> {
    return new Linqable(new Take(this.elements, count))
  }

  /**
     * Takes elements while they satisfy the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {Linqable<TSource>} An iterable of the taken elements.
     */
  takeWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
    return new Linqable(new TakeWhile(this.elements, predicate))
  }

  /**
     * Takes elements until some element satisfies the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {Linqable<TSource>} An iterable of the taken elements.
     */
  takeUntil(predicate: (element: TSource) => boolean): Linqable<TSource> {
    return new Linqable(new TakeWhile(this.elements, el => !predicate(el)))
  }

  /**
     * Filters the elements based on a predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {Linqable<TResult>} An iterable of the filtered elements.
     */
  where(predicate: (element: TSource) => boolean): Linqable<TSource> {
    return new Linqable(new Where(this.elements, predicate))
  }

  /**
     * Transforms the elements of the iterable into another value.
     * @param {function} selector - A function which transforms an element into another value.
     * @returns {Linqable<TResult>} An iterable of the transformed elements.
     */
  select<TResult>(selector: (element: TSource, index: number) => TResult): Linqable<TResult> {
    return new Linqable(new Select(this.elements, selector))
  }

  /**
     * Flattens iterable elements into a single iterable sequence.
     * @param {function} selector - A function which transforms an element into another value.
     * @returns {Linqable<TResult>} An iterable of the transformed elements.
     */
  selectMany<TResult>(selector: (element: TSource) => Iterable<TResult>): Linqable<TResult> {
    return new Linqable(new SelectMany(this.elements, selector))
  }

  /**
     * Applies a transformation function to each corresponding pair of elements from the
     * The paring ends when the shorter sequence ends, the remaining elements of the other sequence are ignored.
     * If a selector is not proviced the result will be an array of [left, right] array pairs.
     * @param {Iterable<TRight>} right - The second iterable.
     * @param {function} selector - A function witch transforms a pair of elements into another value.
     * @returns {Linqable<TResult>} An iterable of the trasnformed values.
     */
  zip<TRight, TResult = [TSource, TRight]>(right: Iterable<TRight>, selector?: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
    return new Linqable(new Zip(this.elements, unwrap(right), (selector || ((a: TSource, b: TRight) => [a, b] as never))))
  }

  /**
      * Returns an unorder sequence of distinct elements based on an equality comparer.
      * When a comparer is not provided a '===' comparison is used.
      * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
      * @returns {Linqable<TSource>} An iterable of the distinct elements.
      */
  distinct(equalityComparer?: EqualityComparer<TSource>): Linqable<TSource> {
    return new Linqable(new Distinct(this.elements, equalityComparer))
  }

  /**
    * Takes the distinct elements based on the result of a selector function.
    * When a comparer is not provided a '===' comparison is used.
    * @param {function} projection - A function the result of which is used for comparing the elements in the iterable.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {Linqable<TSource>} An iterable of the distinct elements.
    */
  distinctBy<TKey>(projection: (element: TSource) => TKey, equalityComparer?: EqualityComparer<TKey>): Linqable<TSource> {
    return new Linqable(new DistinctBy(this.elements, projection, equalityComparer))
  }

  /**
     * Groups elements based on a selector function.
     * @param {function} selector - A function providing the key for the group.
     * @returns {Linqable<Grouping<TKey, TSource>>} An iterable of groups.
     */
  groupBy<TKey>(selector: (element: TSource) => TKey, equalityComparer?: EqualityComparer<TKey>): Linqable<Grouping<TKey, TSource>> {
    return new Linqable(new GroupBy(this.elements, selector, equalityComparer))
  }

  /**
     * Orders elements based on a selector function.
     * @param {function} selector - A function or a selector used for comparing the elements.
     * @returns {OrderedLinqable<TSource>} An iterable of the ordered elements.
     */
  orderBy(selector: (element: TSource) => number | string): OrderedLinqable<TSource> {
    return new OrderedLinqable(Ordered.from(this.elements, selector, true))
  }

  /**
     * Orders elements based on a selector function in desceding order.
     * @param {function} selector - A function or a selector used for comparing the elements.
     * @returns {OrderedLinqable<TSource>} An iterable of the ordered elements.
     */
  orderByDescending(selector: (element: TSource) => number | string): OrderedLinqable<TSource> {
    return new OrderedLinqable(Ordered.from(this.elements, selector, false))
  }

  /**
     * Reverses the order of the sequence, e.g. reverse (1, 2, 3) -> (3, 2, 1)
     * @returns {Linqable<TSource>} An iterable of the reversed squence of elements.
     */
  reverse(): Linqable<TSource> {
    return new Linqable(new Reverse(this.elements))
  }

  /**
     * Concatenates the sequences together.
     * @param {Iterable<TOther>} other - The sequence that will be concatenated to the current sequence.
     * @returns {Linqable<TSource | TOther>} An iterable of the concatenated elements.
     */
  concat<TOther>(other: Iterable<TOther>): Linqable<TSource | TOther> {
    return new Linqable(new Concat(this.elements, unwrap(other)))
  }

  /**
   * Appends values to the end of the sequence.
   * @param {...TOther[]} values - The values that will be appended to the current sequence.
   * @returns {Linqable<TSource | TOther>} An iterable with the appended elements at the end.
   */
  append<TOther>(...values: TOther[]): Linqable<TSource | TOther> {
    if (values.length === 0) {
      return this
    }
    return new Linqable(new Concat(this.elements, unwrap(values)))
  }

  /**
   * Prepends values to the beginning of the sequence.
   * @param {...TOther[]} values - The values that will be prepended to the current sequence.
   * @returns {Linqable<TSource | TOther>} An iterable with the prepended elements at the beginning.
   */
  prepend<TOther>(...values: TOther[]): Linqable<TSource | TOther> {
    if (values.length === 0) {
      return this
    }
    return new Linqable(new Concat(unwrap(values), this.elements))
  }


  /**
     * Reduces the sequence into a value.
     * @param {TResult} seed - A starting value.
     * @param {function} accumulator - An accumulator function.
     * @returns {TResult} An aggregate of the elements.
     */
  aggregate<TResult>(seed: TResult, accumulator: (accumulated: TResult, element: TSource, index: number) => TResult): TResult {
    let accumulated = seed
    let index = 0

    for (const element of this) {
      accumulated = accumulator(accumulated, element, index++)
    }

    return accumulated
  }

  /**
    * Gets the first element of the iterable.
    * @returns {TSource} The first element of the iterable.
    */
  first(): TSource {
    const iter = this[Symbol.iterator]()
    return <TSource>iter.next().value
  }

  /**
     * Gets the first element of the sequence. If a predicate is provided the first element matching the predicated will be returned.
     * If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.
     * @param {function} predicate - A predicate used for finding a matching element.
     * @param {function} defaultInitializer - A function returning default value if there aren't any matching elements.
     * @returns {TSource|TDefault} The first matching element or a default value.
     */
  firstOrDefault<TDefault>(predicate?: (element: TSource) => boolean, defaultInitializer: () => TDefault = () => undefined): TSource | TDefault {
    if (predicate) {
      for (const value of this) {
        if (predicate(value)) {
          return value
        }
      }

      return defaultInitializer()
    } else {
      const iter = this[Symbol.iterator]()
      const descriptor = iter.next()

      return descriptor.done ? defaultInitializer() : <TSource>descriptor.value
    }
  }

  /**
     * Gets the last element of the iterable.
     * @returns {TSource} The last element of the iterable.
     */
  last(): TSource {
    let last
    for (const element of this) {
      last = element
    }
    return last
  }

  /**
     * Gets the last element of the sequence. If a predicate is provided the last element matching the predicated will be returned.
     * If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.
     * @param {function} predicate - A predicate used for finding a matching element.
     * @param {function} defaultInitializer - A function returning default value if there aren't any matching elements.
     * @returns {TSource|TDefault} The last matching element or a default value.
     */
  lastOrDefault<TDefault>(predicate?: (element: TSource) => boolean, defaultInitializer: () => TDefault = () => undefined): TSource | TDefault {
    let last
    let isFound = false
    for (const value of this) {
      if (predicate) {
        if (predicate(value)) {
          last = value
          isFound = true
        }
      } else {
        last = value
        isFound = true
      }
    }

    return isFound ? last : defaultInitializer()
  }

  /**
     * Gets the max element in the sequence. Suitable for sequences of numbers|strings.
     * @returns {TSource} The max element of the sequence.
     */
  max(this: Linqable<TSource extends number ? TSource : TSource extends string ? TSource : never>): TSource {
    return this.maxBy(id)
  }

  /**
     * Gets the max element in a sequence according to a transform function.
     * @param {function} transform - A function returning a primitive value used for copmaring elements in the sequence.
     * @returns {TSource} The max element of the sequence.
     */
  maxBy(transform: (element: TSource) => number | string): TSource {
    const iterator = this[Symbol.iterator]()
    let iteratorResult = iterator.next()

    if (iteratorResult.done) {
      return
    }

    let bestMax = <TSource>iteratorResult.value
    let bestMaxPrimitive = transform(bestMax)

    while (!iteratorResult.done) {
      const value = <TSource>iteratorResult.value
      const currentPrimitive = transform(value)
      if (bestMaxPrimitive < currentPrimitive) {
        bestMax = value
        bestMaxPrimitive = currentPrimitive
      }
      iteratorResult = iterator.next()
    }

    return bestMax
  }

  /**
     * Gets the min element in the sequence. Suitable for sequences of numbers|strings.
     * @returns {TSource} The min element of the sequence.
     */
  min(this: Linqable<TSource extends number ? TSource : TSource extends string ? TSource : never>): TSource {
    return this.minBy(id)
  }

  /**
     * Gets the min element in the sequence according to a transform function.
     * @param {function} transform - A function returning a primitive value used for copmaring elements in the sequence.
     * @returns TSource The min element of the sequence.
     */
  minBy(transform: (element: TSource) => number | string): TSource {
    const iterator = this[Symbol.iterator]()
    let iteratorResult = iterator.next()

    if (iteratorResult.done) {
      return
    }

    let bestMin = <TSource>iteratorResult.value
    let bestMinPrimivie = transform(bestMin)

    while (!iteratorResult.done) {
      const value = <TSource>iteratorResult.value
      const currentPrimivie = transform(value)
      if (bestMinPrimivie > currentPrimivie) {
        bestMin = value
        bestMinPrimivie = currentPrimivie
      }
      iteratorResult = iterator.next()
    }

    return bestMin
  }

  /**
     * Calculates the sum of the values in the sequence.
     * @returns {number} The sum of the values in the sequence.
     */
  sum(this: Linqable<number>): number {
    return this.sumBy(id)
  }

  /**
     * Calculates the sum of the values returned by the selector function.
     * @param {function} transform - A function returning a number value used for summing elements in the sequence.
     * @returns {number} The sum of the values returned by the selector function.
     */
  sumBy(selector: (element: TSource) => number): number {
    return this.aggregate(0, (acc, current) => acc + selector(current))
  }


  /**
     * Calculates the average of the values in the sequence.
     * @returns {number} The average value of the sequence.
     */
  average(this: Linqable<number>): number {
    return this.averageBy(id)
  }

  /**
     * Gets the averege value for a sequence.
     * @param {function} transform - A function returning a number value used for summing elements in the sequence.
     * @returns {number} The average value of the sequence.
     */
  averageBy(transform: (element: TSource) => number): number {
    let sum = 0
    let count = 0

    for (const element of this) {
      sum += transform(element)
      count++
    }

    if (count > 0) {
      const avg = sum / count
      return avg
    }
  }

  /**
     * Tests the equality of two seuqneces by checking each corresponding pair of elements against the provided predicate.
     * If a predicate is not provided the elements will be compared using the strict equality (===) operator.
     * @param {Iterable<TRight>} right - The sequence which will be compared to the current sequence.
     * @param {function} predicate - A function that takes an element of each sequence compares them and returns a boolean depeneding whether they are considered equal or not.
     * @returns {boolean} True if both sequences are of the same length and all corresponding pairs of elements are equal according to the predicate function. False otherwise.
     */
  sequenceEquals<TRight>(right: Iterable<TRight>, predicate: (left: TSource, right: TRight) => boolean = (left: unknown, right: unknown) => left === right): boolean {
    const sourceIterator = this[Symbol.iterator]()
    const rightIterator = right[Symbol.iterator]()

    let [sourceResult, rightResult] = [sourceIterator.next(), rightIterator.next()]

    while (!sourceResult.done && !rightResult.done) {
      if (!sourceResult.done && !rightResult.done && !predicate(<TSource>sourceResult.value, rightResult.value)) {
        return false
      }

      sourceResult = sourceIterator.next()
      rightResult = rightIterator.next()
    }

    return sourceResult.done && rightResult.done
  }

  /**
     * Calls a function for each element of the sequence.
     * The function receives the element and its index in the seqeunce as parameters.
     * @param {function} action - A function called for each element of the sequence.
     */
  forEach(action: (element: TSource, index: number) => void): void {
    let index = 0
    for (const element of this) {
      action(element, index++)
    }
  }

  /**
     * Gets the element at an index.
     * @param {number} index - The index of the element.
     * @returns {TSource} The element at the specified index.
     */
  elementAt(index: number): TSource {
    return this.skip(index).take(1).first()
  }

  /**
     * Turns the sequence into an array.
     * @returns {TSource[]} An array of the sequence elements.
     */
  toArray(): TSource[] {
    const array = this.aggregate([], (acc, el) => {
      acc.push(el)
      return acc
    })

    return array
  }

  /**
   * Turns the sequence into a map.
   * Throws an error if there are multiple elements with the same key.
   * @param {Function} keySelector - A function which returns the key for an element in the sequence.
   * @param {Function} valueSelector - An optional function which returns the value for the key. Will use the source value if not
   * @returns {Map<TKey, TValue>} A map of elements in the sequence.
   */
  toMap<TKey, TValue = TSource>(keySelector: (element: TSource) => TKey, valueSelector?: (element: TSource) => TValue): Map<TKey, TValue> {
    return this.aggregate(new Map<TKey, TValue>(), (map, current) => {
      const key = keySelector(current)
      if (map.has(key)) {
        throw Error(`An element with key "${key}" has already been added.`)
      }

      return map.set(key, typeof valueSelector === 'function' ? valueSelector(current) : current as never)
    })
  }

  /**
   * Turns the sequence into a map.
   * @param {Function} keySelector - A function which returns the key for an element in the sequence.
   * @param {Function} valueSelector - An optional function which returns the value for the key. Will use the source value if not
   * @returns {Map<TKey, TValue>} A map of elements in the sequence.
   */
  toMapMany<TKey, TValue = TSource>(keySelector: (element: TSource) => TKey, valueSelector?: (element: TSource) => TValue): Map<TKey, TValue[]> {
    return this.aggregate(new Map<TKey, TValue[]>(), (map, current) => {
      const key = keySelector(current)
      const value = map.get(key) || []
      value.push(typeof valueSelector === 'function' ? valueSelector(current) : current as never)
      return map.set(key, value)
    })
  }

  /**
     * Counts the number of elements in the sequence.
     * @returns {number} The number of elements in the sequence.
     */
  count(): number {
    let current = 0
    const iterator = this[Symbol.iterator]()

    while (iterator.next()) {
      current++
    }

    return current
  }

  /**
    * Excludes all elements of the provided sequence from the current sequence.
    * @param {Iterable<TSource>} right - The sequence of elements that will be excluded.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {Linqable<TSource>} A sequence of the elements which are not present in the provided sequence.
    */
  except(right: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Linqable<TSource> {
    return new Linqable(new Except(this.elements, unwrap(right), equalityComparer))
  }

  /**
    * Intersects the current sequence with the provided sequence.
    * @param {Iterable<TSource>} right - The sequence of elements that will be intersected with the current seqeunce.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {Linqable<TSource>} A sequence of the elements which are present in both the provided sequences.
    */
  intersect(right: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Linqable<TSource> {
    return new Linqable(new Intersect(this.elements, unwrap(right), equalityComparer))
  }

  /**
    * Performs a union operation on the current sequence and the provided sequence.
    * @param {Iterable<TSource>} right - The other sequence with which a union will be performed.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {Linqable<TSource>} A sequence of the unique elements of both sequences.
    */
  union(right: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Linqable<TSource> {
    return new Linqable(new Union(this.elements, unwrap(right), equalityComparer))
  }

  /**
    * Returns the symmetric difference of both sequences.
    * @param {Iterable<TSource>} right - The other sequence.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {Linqable<TSource>} The elements which are present in only sequences.
    */
  xOr(right: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Linqable<TSource> {
    return this.except(right, equalityComparer).union(new Linqable(right).except(this, equalityComparer), equalityComparer)
  }

  /**
     * Provides batches of elements from the sequence.
     * @param {number} size - The size of the batch.
     * @param {boolean} dropRemainder - Indicates whether to drop the last batch if it is not of full size.
     * @returns {Linqable<TSource[]>} A sequence of batches.
     */
  batch(size: number, dropRemainder = false): Linqable<TSource[]> {
    const step = size
    return new Linqable(new Windowed(this.elements, size, step, dropRemainder))
  }

  /**
     * Provides a sliding window of elements from the sequence.
     * @param {number} size - The size of the window.
     * @param {number} step - The number of elements to skip when sliding.
     * @returns {Linqable<TSource[]>} A sequence of windows.
     */
  windowed(size: number, step = 1): Linqable<TSource[]> {
    return new Linqable(new Windowed(this.elements, size, step))
  }

  /**
     * Gets the index of the first matching element in the sequence.
     * @param {TSource} element - The element to look for.
     * @returns {number} The index of the element.
     */
  indexOf(element: TSource): number {
    return this.findIndex(el => el === element)
  }

  /**
     * Gets the index of the element in the sequence matching the predicate.
     * @param {Function} predicate - A function which checks if the element is a match.
     * @returns {number} The index of the element.
     */
  findIndex(predicate: (element: TSource) => boolean): number {
    let index = 0

    for (const el of this) {
      if (predicate(el)) {
        return index
      }
      index++
    }

    return -1
  }

  /**
   * Gets the last index of the element in the sequence.
   * @param {TSource} element - The element to look for.
   * @returns {number} The index of the element.
   */
  lastIndexOf(element: TSource): number {
    return this.findLastIndex(el => el === element)
  }

  /**
     * Gets the index of the last element in the sequence matching the predicate.
     * @param {Function} predicate - A function which checks if the element is a match.
     * @returns {number} The index of the element.
     */
  findLastIndex(predicate: (element: TSource) => boolean): number {
    let index = 0
    let lastIndex = -1
    for (const el of this) {
      if (predicate(el)) {
        lastIndex = index
      }
      index++
    }

    return lastIndex
  }

  /**
   * Executes an action on each element of the sequence and yields the element.
   * @param action - The action to execute on each element.
   */
  tap(action: (element: TSource) => void): Linqable<TSource> {
    return new Linqable(new Tap(this.elements, action))
  }

  /**
   * Repeats the sequence. Will repeat the sequence infinitely if called withouth a parameter.
   * @param count - The number of times to repeat the sequence.
   * @returns The repeated sequence.
   */
  repeat(count = Infinity): Linqable<TSource> {
    return new Linqable(new Repeat(this.elements, count))
  }

  toString(): string {
    return Linqable.name
  }
}

export class OrderedLinqable<TSource> extends Linqable<TSource> {
  constructor(elements: Ordered<TSource>) {
    super(elements)
  }

  /**
   * Chains an additional ascending ordering based on the key returned by the selector function.
   * @param selector - A function which returns a key which will be used for comparisons.
   */
  thenBy(this: OrderedLinqable<TSource>, selector: (element: TSource) => string | number): OrderedLinqable<TSource> {
    return this.from(selector, true)
  }

  /**
    * Chains an additional descending ordering based on the key returned by the selector function.
    * @param selector - A function which returns a key which will be used for comparisons.
    */
  thenByDescending(this: OrderedLinqable<TSource>, selector: (element: TSource) => string | number): OrderedLinqable<TSource> {
    return this.from(selector, false)
  }

  toString(): string {
    return OrderedLinqable.name
  }

  private from(selector: (element: TSource) => string | number, isAscending: boolean): OrderedLinqable<TSource> {
    const ordered = this.elements as Ordered<TSource>
    return new OrderedLinqable(ordered.from(selector, isAscending))
  }
}

export function unwrap<T>(iterable: Linqable<T> | Iterable<T>): Iterable<T> {
  return iterable instanceof Linqable && isWrapper(iterable) ? iterable[elementsSymbol]().next().value : iterable
}