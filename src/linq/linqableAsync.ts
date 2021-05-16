import { AsyncSource, id, SyncSource } from '.'
import { EqualityComparer, LinqMap, LinqSet } from './collections'
import { elementsSymbol, ElementsWrapper, isWrapper } from './element-wrapper'
import { Concat, Distinct, DistinctBy, Except, GroupBy, Grouping, Intersect, Join, Ordered, Repeat, Reverse, Select, SelectMany, Skip, SkipWhile, Take, TakeWhile, Tap, Union, Where, Windowed, Zip } from './iterables'
import { GeneratorFunc } from './iterables/generatorFunc'
import { Memoized } from './iterables/memoized'
import { Scan } from './iterables/scan'
import { Linqable, ToMapArgs } from './linqable'

export type SelectManyAsyncResult<TResult> = TResult extends Many<Promise<unknown>> ? ManyAwaited<TResult> : TResult extends Many<infer U> ? U : ManyAwaited<TResult>
export type ManyAwaited<T> = T extends Many<Promise<infer Q>> ? Awaited<Q> : T extends Promise<Many<infer Q>> ? Awaited<Q> : T extends Promise<infer Q> ? ManyAwaited<Q> : T
type Awaited<T> = T extends Promise<infer Q> ? Awaited<Q> : T
type Many<T> = Iterable<T> | AsyncIterable<T>


export class AsyncLinqable<TSource> implements AsyncIterable<TSource>, ElementsWrapper<TSource> {
  constructor(protected elements: Iterable<TSource> | AsyncIterable<TSource>) {
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    yield* this.elements
  }

  *[elementsSymbol](): IterableIterator<Iterable<TSource> | AsyncIterable<TSource>> {
    yield this.elements
  }

  /**
     * Checks if any of the elements match the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
  async any(predicate?: (element: TSource) => boolean | Promise<boolean>): Promise<boolean> {
    if (predicate) {
      for await (const value of this) {
        if (await predicate(value)) {
          return true
        }
      }
    } else {
      const iter = this[Symbol.asyncIterator]()
      return !(await iter.next()).done
    }

    return false
  }

  /**
     * Checks if all of the elements match the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
  async all(predicate: (element: TSource) => boolean | Promise<boolean>): Promise<boolean> {
    for await (const value of this) {
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
     * @returns {AsyncLinqable<TResult>} An iterable of values produced by resultSelector
     */
  join<TRight, TResult>(right: Iterable<TRight> | AsyncIterable<TRight>,
    leftSelector: (element: TSource) => unknown,
    rightSelector: (element: TRight) => unknown,
    resultSelector: (left: TSource, right: TRight) => TResult | Promise<TResult>): AsyncLinqable<TResult> {
    return new AsyncLinqable(new Join(this.elements,
      extractAsync(right),
      leftSelector,
      rightSelector,
      resultSelector
    ))
  }

  /**
     * Skips a specific number of elements.
     * @param {number} count - The number of elements to skip.
     * @returns {AsyncLinqable<TSource>} An iterable with a beginning after the skipped values.
     */
  skip(count: number): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Skip(this.elements, count))
  }

  /**
     * Skips elements while they satisfy the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {AsyncLinqable<TSource>} An iterable with a beginning after the skipped values.
     */
  skipWhile(predicate: (element: TSource) => boolean | Promise<boolean>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new SkipWhile(this.elements, predicate))
  }

  /**
   * Skips elements until some element satisfies the provided predicate.
   * @param {function} predicate - A predicate which the elements will be checked against.
   * @returns {AsyncLinqable<TSource>} An iterable with a beginning after the skipped values.
   */
  skipUntil(predicate: (element: TSource) => boolean | Promise<boolean>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new SkipWhile(this.elements, async el => !await predicate(el)))
  }

  /**
     * Takes a specific number of elements.
     * @param {number} count - The number of elements to take.
     * @returns {AsyncLinqable<TSource>} An iterable for the taken elements.
     */
  take(count: number): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Take(this.elements, count))
  }

  /**
     * Takes elements while they satisfy the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {AsyncLinqable<TSource>} An iterable of the taken elements.
     */
  takeWhile(predicate: (element: TSource) => boolean | Promise<boolean>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new TakeWhile(this.elements, predicate))
  }

  /**
     * Takes elements until some element satisfies the provided predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {AsyncLinqable<TSource>} An iterable of the taken elements.
     */
  takeUntil(predicate: (element: TSource) => boolean | Promise<boolean>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new TakeWhile(this.elements, async el => !await predicate(el)))
  }

  /**
     * Filters the elements based on a predicate.
     * @param {function} predicate - A predicate which the elements will be checked against.
     * @returns {AsyncLinqable<TResult>} An iterable of the filtered elements.
     */
  where(predicate: (element: TSource) => boolean | Promise<boolean>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Where(this.elements, predicate))
  }

  /**
     * Transforms the elements of the iterable into another value.
     * @param {function} selector - A function which transforms an element into another value.
     * @returns {AsyncLinqable<TResult>} An iterable of the transformed elements.
     */
  select<TResult>(selector: (element: TSource, index: number) => TResult | Promise<TResult>): AsyncLinqable<TResult> {
    return new AsyncLinqable(new Select(this.elements, selector))
  }

  /**
     * Flattens iterable elements into a single iterable sequence.
     * @param {function} selector - A function which transforms an element into another value.
     * @returns {AsyncLinqable<TResult>} An iterable of the transformed elements.
     */
  selectMany<TResult>(selector: (element: TSource) => TResult | Promise<TResult>): AsyncLinqable<SelectManyAsyncResult<TResult>> {
    return new AsyncLinqable(new SelectMany(this.elements, selector))
  }

  /**
     * Applies a transformation function to each corresponding pair of elements from the
     * The paring ends when the shorter sequence ends, the remaining elements of the other sequence are ignored.
     * If a selector is not proviced the result will be an array of [left, right] array pairs.
     * @param {Iterable<TRight>} right - The second iterable.
     * @param {function} selector - A function witch transforms a pair of elements into another value.
     * @returns {AsyncLinqable<TResult>} An iterable of the trasnformed values.
     */
  zip<TRight, TResult = [TSource, TRight]>(right: Iterable<TRight> | AsyncIterable<TRight>, selector?: (left: TSource, right: TRight) => TResult | Promise<TResult>): AsyncLinqable<TResult> {
    return new AsyncLinqable(new Zip(this.elements, extractAsync(right), selector || ((a: TSource, b: TRight) => [a, b] as never)))
  }

  /**
      * Returns an unordered sequence of distinct elements based on an equality comparer.
      * When a comparer is not provided a strict equality comparison is used.
      * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
      * @returns {AsyncLinqable<TSource>} An iterable of the distinct elements.
      */
  distinct(equalityComparer?: EqualityComparer<TSource>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Distinct(this.elements, equalityComparer))
  }

  /**
    * Takes the distinct elements based on the result of a selector function.
    * When a comparer is not provided a '===' comparison is used.
    * @param {function} projection - A function the result of which is used for comparing the elements in the iterable.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {AsyncLinqable<TSource>} An iterable of the distinct elements.
    */
  distinctBy<TKey>(projection: (element: TSource) => TKey | Promise<TKey>, equalityComparer?: EqualityComparer<TKey>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new DistinctBy(this.elements, projection, equalityComparer))
  }

  /**
     * Groups elements based on a selector function.
     * @param {function} selector - A function providing the key for the group.
     * @returns {AsyncLinqable<Grouping<TKey, TSource>>} An iterable of groups.
     */
  groupBy<TKey>(selector: (element: TSource) => TKey | Promise<TKey>, equalityComparer?: EqualityComparer<TKey>): AsyncLinqable<Grouping<TKey, TSource>> {
    return new AsyncLinqable(new GroupBy(this.elements, selector, equalityComparer))
  }

  /**
     * Orders elements based on a selector function.
     * @param {function} selector - A function or a selector used for comparing the elements.
     * @returns {OrderedLinqableAsync<TSource>} An iterable of the ordered elements.
     */
  orderBy(selector: (element: TSource) => number | string): OrderedLinqableAsync<TSource> {
    return new OrderedLinqableAsync(Ordered.from(this.elements, selector, true))
  }

  /**
     * Orders elements based on a selector function in desceding order.
     * @param {function} selector - A function or a selector used for comparing the elements.
     * @returns {OrderedLinqableAsync<TSource>} An iterable of the ordered elements.
     */
  orderByDescending(selector: (element: TSource) => number | string): OrderedLinqableAsync<TSource> {
    return new OrderedLinqableAsync(Ordered.from(this.elements, selector, false))
  }

  /**
     * Reverses the order of the sequence, e.g. reverse (1, 2, 3) -> (3, 2, 1)
     * @returns {AsyncLinqable<TSource>} An iterable of the reversed squence of elements.
     */
  reverse(): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Reverse(this.elements))
  }

  /**
     * Concatenates the sequences together.
     * @param {Iterable<TOther>} other - The sequence that will be concatenated to the current sequence.
     * @returns {AsyncLinqable<TSource | TOther>} An iterable of the concatenated elements.
     */
  concat<TOther>(other: Iterable<TOther> | AsyncIterable<TOther>): AsyncLinqable<TSource | TOther> {
    return new AsyncLinqable(new Concat(this.elements, extractAsync(other)))
  }

  /**
   * Appends values to the end of the sequence.
   * @param {...TOther[]} values - The values that will be appended to the current sequence.
   * @returns {AsyncLinqable<TSource | TOther>} An iterable with the appended elements at the end.
   */
  append<TOther>(...values: TOther[]): AsyncLinqable<TSource | TOther> {
    if (values.length === 0) {
      return this
    }
    return new AsyncLinqable(new Concat(this.elements, extractAsync(values)))
  }

  /**
   * Prepends values to the beginning of the sequence.
   * @param {...TOther[]} values - The values that will be prepended to the current sequence.
   * @returns {AsyncLinqable<TSource | TOther>} An iterable with the prepended elements at the beginning.
   */
  prepend<TOther>(...values: TOther[]): AsyncLinqable<TSource | TOther> {
    if (values.length === 0) {
      return this
    }
    return new AsyncLinqable(new Concat(extractAsync(values), this.elements))
  }


  /**
     * Reduces the sequence into a value.
     * @param {function} accumulator - An accumulator function.
     * @param {TResult} seed - A starting value.
     * @returns {TResult} An aggregate of the elements.
     */
  async aggregate<TResult = TSource>(accumulator: (accumulated: TResult, element: TSource, index: number) => TResult | Promise<TResult>, seed?: TResult): Promise<TResult> {
    const iterator = (typeof this.elements[Symbol.asyncIterator] === 'function' && this.elements[Symbol.asyncIterator]() ||
      typeof this.elements[Symbol.iterator] === 'function' && this.elements[Symbol.iterator]()) as IterableIterator<TSource> | AsyncIterableIterator<TSource>

    let index = 0

    let accumulated = seed
    if (typeof seed === 'undefined') {
      const result = await iterator.next()
      if (!result.done) {
        accumulated = result.value
        const second = await iterator.next()
        index++
        if (!second.done) {
          accumulated = await accumulator(result.value, second.value, index++) as TResult
        }
      }
    }
    let result = await iterator.next()
    while (!result.done) {
      accumulated = await accumulator(accumulated, result.value, index++) as TResult
      result = await iterator.next()
    }
    return accumulated
  }

  scan<TResult = TSource>(accumulator: (accumulated: TResult, element: TSource, index: number) => TResult | Promise<TResult>, seed?: TResult): AsyncLinqable<TResult> {
    return new AsyncLinqable(new Scan(this.elements, seed, accumulator))
  }

  /**
    * Gets the first element of the iterable.
    * @returns {TSource} The first element of the iterable.
    */
  async first(): Promise<TSource> {
    const iter = this[Symbol.asyncIterator]()
    return (await iter.next()).value
  }

  /**
     * Gets the first element of the sequence. If a predicate is provided the first element matching the predicated will be returned.
     * If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.
     * @param {function} predicate - A predicate used for finding a matching element.
     * @param {function} defaultInitializer - A function returning default value if there aren't any matching elements.
     * @returns {TSource|TDefault} The first matching element or a default value.
     */
  async firstOrDefault<TDefault>(predicate?: (element: TSource) => Promise<boolean>, defaultInitializer: () => Promise<TDefault> = () => undefined): Promise<TSource | TDefault> {
    if (predicate) {
      for await (const value of this) {
        if (await predicate(value)) {
          return value
        }
      }

      return await defaultInitializer()
    } else {
      const iter = this[Symbol.asyncIterator]() as AsyncIterableIterator<TSource>
      const descriptor = await iter.next()

      return descriptor.done ? await defaultInitializer() : <TSource>descriptor.value
    }
  }

  /**
     * Gets the last element of the iterable.
     * @returns {TSource} The last element of the iterable.
     */
  async last(): Promise<TSource> {
    let last
    for await (const element of this) {
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
  async lastOrDefault<TDefault>(predicate?: (element: TSource) => Promise<boolean>, defaultInitializer: () => Promise<TDefault> = () => undefined): Promise<TSource | TDefault> {
    let last
    let isFound = false
    for await (const value of this) {
      if (predicate) {
        if (await predicate(value)) {
          last = value
          isFound = true
        }
      } else {
        last = value
        isFound = true
      }
    }

    return isFound ? last : await defaultInitializer()
  }

  /**
     * Gets the max element in the sequence. Suitable for sequences of numbers|strings.
     * @returns {TSource} The max element of the sequence.
     */
  async max(this: AsyncLinqable<TSource extends number ? TSource : TSource extends string ? TSource : never>): Promise<TSource> {
    return await this.maxBy(id)
  }

  /**
     * Gets the max element in a sequence according to a transform function.
     * @param {function} transform - A function returning a primitive value used for copmaring elements in the sequence.
     * @returns {TSource} The max element of the sequence.
     */
  async maxBy(transform: (element: TSource) => number | string | Promise<number | string>): Promise<TSource> {
    const iterator = this[Symbol.asyncIterator]() as AsyncIterableIterator<TSource>
    let iteratorResult = await iterator.next()

    if (iteratorResult.done) {
      return
    }

    let bestMax = <TSource>iteratorResult.value
    let bestMaxPrimitive = await transform(bestMax)

    while (!iteratorResult.done) {
      const value = <TSource>iteratorResult.value
      const currentPrimitive = await transform(value)
      if (bestMaxPrimitive < currentPrimitive) {
        bestMax = value
        bestMaxPrimitive = currentPrimitive
      }
      iteratorResult = await iterator.next()
    }

    return bestMax
  }

  /**
     * Gets the min element in the sequence. Suitable for sequences of numbers|strings.
     * @returns {TSource} The min element of the sequence.
     */
  async min(this: AsyncLinqable<TSource extends number ? TSource : TSource extends string ? TSource : never>): Promise<TSource> {
    return await this.minBy(id)
  }

  /**
     * Gets the min element in the sequence according to a transform function.
     * @param {function} transform - A function returning a primitive value used for copmaring elements in the sequence.
     * @returns TSource The min element of the sequence.
     */
  async minBy(transform: (element: TSource) => number | string | Promise<number | string>): Promise<TSource> {
    const iterator = this[Symbol.asyncIterator]()
    let iteratorResult = await iterator.next()

    if (iteratorResult.done) {
      return
    }

    let bestMin = <TSource>iteratorResult.value
    let bestMinPrimivie = await transform(bestMin)

    while (!iteratorResult.done) {
      const value = <TSource>iteratorResult.value
      const currentPrimivie = await transform(value)
      if (bestMinPrimivie > currentPrimivie) {
        bestMin = value
        bestMinPrimivie = currentPrimivie
      }
      iteratorResult = await iterator.next()
    }

    return bestMin
  }

  /**
     * Calculates the sum of the values in the sequence.
     * @returns {number} The sum of the values in the sequence.
     */
  async sum(this: AsyncLinqable<number>): Promise<number> {
    return await this.sumBy(id)
  }

  /**
     * Calculates the sum of the values returned by the selector function.
     * @param {function} transform - A function returning a number value used for summing elements in the sequence.
     * @returns {number} The sum of the values returned by the selector function.
     */
  async sumBy(selector: (element: TSource) => number | Promise<number>): Promise<number> {
    return await this.aggregate(async (acc, current) => acc + await selector(current), 0)
  }


  /**
     * Calculates the average of the values in the sequence.
     * @returns {number} The average value of the sequence.
     */
  async average(this: AsyncLinqable<number>): Promise<number> {
    return await this.averageBy(id)
  }

  /**
     * Gets the averege value for a sequence.
     * @param {function} transform - A function returning a number value used for summing elements in the sequence.
     * @returns {number} The average value of the sequence.
     */
  async averageBy(transform: (element: TSource) => number | Promise<number>): Promise<number> {
    let sum = 0
    let count = 0

    for await (const element of this) {
      sum += await transform(element)
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
     * @param {Iterable<TRight> | AsyncIterable<TRight>} right - The sequence which will be compared to the current sequence.
     * @param {function} predicate - A function that takes an element of each sequence compares them and returns a boolean depeneding whether they are considered equal or not.
     * @returns {boolean} True if both sequences are of the same length and all corresponding pairs of elements are equal according to the predicate function. False otherwise.
     */
  async sequenceEquals<TRight>(right: Iterable<TRight> | AsyncIterable<TRight>, predicate: (left: TSource, right: TRight) => boolean | Promise<boolean> = (left: unknown, right: unknown) => left === right): Promise<boolean> {
    const sourceIterator = this[Symbol.asyncIterator]()
    const rightIterator = right[Symbol.asyncIterator]() as AsyncIterableIterator<TRight>

    let [sourceResult, rightResult] = [await sourceIterator.next(), await rightIterator.next()]

    while (!sourceResult.done && !rightResult.done) {
      if (!sourceResult.done && !rightResult.done && !await predicate(<TSource>sourceResult.value, rightResult.value)) {
        return false
      }

      sourceResult = await sourceIterator.next()
      rightResult = await rightIterator.next()
    }

    return sourceResult.done && rightResult.done
  }

  /**
     * Calls a function for each element of the sequence.
     * The function receives the element and its index in the seqeunce as parameters.
     * @param {function} action - A function called for each element of the sequence.
     */
  async forEach(action: (element: TSource, index: number) => void | Promise<void>): Promise<void> {
    let index = 0
    for await (const element of this) {
      await action(element, index++)
    }
  }

  /**
     * Gets the element at an index.
     * @param {number} index - The index of the element.
     * @returns {TSource} The element at the specified index.
     */
  async elementAt(index: number): Promise<TSource> {
    return await this.skip(index).take(1).first()
  }

  /**
     * Turns the sequence into an array.
     * @returns {TSource[]} An array of the sequence elements.
     */
  async toArray(): Promise<TSource[]> {
    const array = await this.aggregate((acc, el) => {
      acc.push(el)
      return acc
    }, [])

    return array
  }

  /**
   * Turns the sequence into a map.
   * Throws an error if there are multiple elements with the same key.
   * @param {Function} keySelector - A function which returns the key for an element in the sequence.
   * @param {Function} valueSelector - An optional function which returns the value for the key. Will use the source value if not
   * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
   * @returns {Map<TKey, TValue>} A map of elements in the sequence. When an equality comparer is provided the instance will be an instance of LinqMap.
   */
  async toMap<TKey, TValue = TSource>({ keySelector, valueSelector, equalityComparer }: ToMapArgs<TSource, TKey, TValue>): Promise<Map<TKey, TValue>> {
    const seed = equalityComparer ? new LinqMap(equalityComparer) : new Map()
    return this.aggregate((map, current) => {
      const key = keySelector(current)
      if (map.has(key)) {
        throw Error(`An element with key "${key}" has already been added.`)
      }

      return map.set(key, typeof valueSelector === 'function' ? valueSelector(current) : current as never)
    }, seed)
  }

  /**
   * Turns the sequence into a map.
   * @param {Function} keySelector - A function which returns the key for an element in the sequence.
   * @param {Function} valueSelector - An optional function which returns the value for the key. Will use the source value if not
   * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
   * @returns {Map<TKey, TValue>} A map of elements in the sequence. When an equality comparer is provided the instance will be an instance of LinqMap.
   */
  async toMapMany<TKey, TValue = TSource>({ keySelector, valueSelector, equalityComparer }: ToMapArgs<TSource, TKey, TValue>): Promise<Map<TKey, TValue[]>> {
    const seed = equalityComparer ? new LinqMap(equalityComparer) : new Map()
    return this.aggregate((map, current) => {
      const key = keySelector(current)
      const value = map.get(key) || []
      value.push(typeof valueSelector === 'function' ? valueSelector(current) : current as never)
      return map.set(key, value)
    }, seed)
  }

  /**
   * Turns the sequence into a set.
   * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
   * @returns {Map<TKey, TValue>} A set of the elements in the sequence. When an equality comparer is provided the instance will be an instance of LinqSet.
   */
  async toSet(equalityComparer?: EqualityComparer<TSource>): Promise<Set<TSource>> {
    const set = equalityComparer ? new LinqSet<TSource>(equalityComparer) : new Set<TSource>()
    for await (const element of this) {
      set.add(element)
    }
    return set
  }

  /**
     * Counts the number of elements in the sequence.
     * @returns {number} The number of elements in the sequence.
     */
  async count(): Promise<number> {
    let current = 0
    const iterator = this[Symbol.asyncIterator]() as AsyncIterableIterator<TSource>

    while (!(await iterator.next()).done) {
      current++
    }

    return current
  }

  /**
    * Excludes all elements of the provided sequence from the current sequence.
    * @param {Iterable<TSource>} right - The sequence of elements that will be excluded.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {AsyncLinqable<TSource>} A sequence of the elements which are not present in the provided sequence.
    */
  except(right: AsyncIterable<TSource>, equalityComparer?: EqualityComparer<TSource>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Except(this.elements, extractAsync(right), equalityComparer))
  }

  /**
    * Intersects the current sequence with the provided sequence.
    * @param {Iterable<TSource>} right - The sequence of elements that will be intersected with the current seqeunce.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {AsyncLinqable<TSource>} A sequence of the elements which are present in both the provided sequences.
    */
  intersect(right: AsyncIterable<TSource>, equalityComparer?: EqualityComparer<TSource>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Intersect(this.elements, extractAsync(right), equalityComparer))
  }

  /**
    * Performs a union operation on the current sequence and the provided sequence.
    * @param {Iterable<TSource>} right - The other sequence with which a union will be performed.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {AsyncLinqable<TSource>} A sequence of the unique elements of both sequences.
    */
  union(right: AsyncIterable<TSource>, equalityComparer?: EqualityComparer<TSource>): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Union(this.elements, extractAsync(right), equalityComparer))
  }

  /**
    * Returns the symmetric difference of both sequences.
    * @param {Iterable<TSource>} right - The other sequence.
    * @param {EqualityComparer<TSource>} equalityComparer - An object providing a hash and equals function.
    * @returns {AsyncLinqable<TSource>} The elements which are present in only sequences.
    */
  xOr(right: AsyncIterable<TSource>, equalityComparer?: EqualityComparer<TSource>): AsyncLinqable<TSource> {
    return this.except(right, equalityComparer).union(new AsyncLinqable(right).except(this, equalityComparer), equalityComparer)
  }

  /**
     * Provides batches of elements from the sequence.
     * @param {number} size - The size of the batch.
     * @param {boolean} dropRemainder - Indicates whether to drop the last batch if it is not of full size.
     * @returns {AsyncLinqable<TSource[]>} A sequence of batches.
     */
  batch(size: number, dropRemainder = false): AsyncLinqable<TSource[]> {
    const step = size
    return new AsyncLinqable(new Windowed(this.elements, size, step, dropRemainder))
  }

  /**
     * Provides a sliding window of elements from the sequence.
     * @param {number} size - The size of the window.
     * @param {number} step - The number of elements to skip when sliding.
     * @returns {AsyncLinqable<TSource[]>} A sequence of windows.
     */
  windowed(size: number, step = 1): AsyncLinqable<TSource[]> {
    return new AsyncLinqable(new Windowed(this.elements, size, step))
  }

  /**
     * Gets the index of the first matching element in the sequence.
     * @param {TSource} element - The element to look for.
     * @returns {number} The index of the element.
     */
  async indexOf(element: TSource): Promise<number> {
    return this.findIndex(el => el === element)
  }

  /**
     * Gets the index of the element in the sequence matching the predicate.
     * @param {Function} predicate - A function which checks if the element is a match.
     * @returns {number} The index of the element.
     */
  async findIndex(predicate: (element: TSource) => boolean | Promise<boolean>): Promise<number> {
    let index = 0

    for await (const el of this) {
      if (await predicate(el)) {
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
  async lastIndexOf(element: TSource): Promise<number> {
    return this.findLastIndex(el => el === element)
  }

  /**
     * Gets the index of the last element in the sequence matching the predicate.
     * @param {Function} predicate - A function which checks if the element is a match.
     * @returns {number} The index of the element.
     */
  async findLastIndex(predicate: (element: TSource) => boolean | Promise<boolean>): Promise<number> {
    let index = 0
    let lastIndex = -1
    for await (const el of this) {
      if (await predicate(el)) {
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
  tap(action: (element: TSource) => void): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Tap(this.elements, action))
  }

  /**
   * Repeats the sequence. Will repeat the sequence infinitely if called withouth a parameter.
   * @param count - The number of times to repeat the sequence.
   * @returns The repeated sequence.
   */
  repeat(count = Infinity): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Repeat(this.elements, count))
  }

  memoized(): AsyncLinqable<TSource> {
    return new AsyncLinqable(new Memoized(this.elements))
  }

  toString(): string {
    return AsyncLinqable.name
  }
}

export class OrderedLinqableAsync<TSource> extends AsyncLinqable<TSource> {
  constructor(elements: Ordered<TSource>) {
    super(elements)
  }

  /**
   * Chains an additional ascending ordering based on the key returned by the selector function.
   * @param selector - A function which returns a key which will be used for comparisons.
   */
  thenBy(this: OrderedLinqableAsync<TSource>, selector: (element: TSource) => string | number): OrderedLinqableAsync<TSource> {
    return this.from(selector, true)
  }

  /**
    * Chains an additional descending ordering based on the key returned by the selector function.
    * @param selector - A function which returns a key which will be used for comparisons.
    */
  thenByDescending(this: OrderedLinqableAsync<TSource>, selector: (element: TSource) => string | number): OrderedLinqableAsync<TSource> {
    return this.from(selector, false)
  }

  toString(): string {
    return OrderedLinqableAsync.name
  }

  private from(selector: (element: TSource) => string | number, isAscending: boolean): OrderedLinqableAsync<TSource> {
    const ordered = this.elements as Ordered<TSource>
    return new OrderedLinqableAsync(ordered.from(selector, isAscending))
  }
}

export function extractAsync<T>(iterable: Linqable<T> | AsyncLinqable<T> | SyncSource<T> | AsyncSource<T>): Iterable<T> | AsyncIterable<T> {
  if ((iterable instanceof Linqable || iterable instanceof AsyncLinqable) && isWrapper(iterable))
    return iterable[elementsSymbol]().next().value
  else if (typeof iterable === 'function')
    return new GeneratorFunc(iterable)
  else if (typeof iterable[Symbol.iterator] === 'function' || typeof iterable[Symbol.asyncIterator] === 'function')
    return iterable

  throw Error('Undexpected input')
}