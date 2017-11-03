import * as Iterables from "./iterables";

export class Linqable<TSource> implements Iterable<TSource> {
    constructor (public elements: Iterable<TSource>) {

    }

    *[Symbol.iterator]() {
        yield* this.elements;
    }

    /**
     * Checks if any of the elements match the provided predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
    any(predicate?: (element: TSource) => boolean): boolean {
        if (predicate) {
            for (let value of this) {
                if (predicate(value)) {
                    return true;
                }
            }
        }
        else {
            let iter = this[Symbol.iterator]();
            return !iter.next().done;
        }

        return false;
    }

    /**
     * Checks if all of the elements match the provided predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @return {boolean} Whether an element matching the predicate is found or not.
     */
    all(predicate: (element: TSource) => boolean): boolean {
        for (let value of this) {
            if (!predicate(value)) {
                return false;
            }
        }
    }

    /**
     * Performs a join on objects matching property values according to the provided leftSelector and rightSelector.
     * The matching objects are merged into another value by resultSelector.
     * @param  {Iterable<TRight>} right The collection being to which the join is performed
     * @param  {function} leftSelector A property selector for objects from the left collection
     * @param  {function} rightSelector A property selector for objects from the right collection
     * @param  {function} resultSelector A function merging the matching objects into a result
     * @returns {Linqable} An iterable of values produced by resultSelector
     */
    join<TRight, TResult>(right: Iterable<TRight>,
        leftSelector: (element: TSource) => any,
        rightSelector: (element: TRight) => any,
        resultSelector: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
        return new Linqable(new Iterables.Join<TSource, TRight, TResult>(this,
            right,
            leftSelector,
            rightSelector,
            resultSelector
        ));
    }

    /**
     * Skips a specific number of elements.
     * @param  {number} count The number of elements to skip.
     * @returns An iterable with a beginning after the skipped values.
     */
    skip(count: number): Linqable<TSource> {
        return new Linqable(new Iterables.Skip<TSource>(this, count));
    }

    /**
     * Skips elements while they satisfy the provided predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable with a beginning after the skipped values.
     */
    skipWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Linqable(new Iterables.SkipWhile<TSource>(this, predicate));
    }

    /**
     * Takes a specific number of elements.
     * @param  {number} count The number of elements to take.
     * @returns An iterable for the taken elements.
     */
    take(count: number): Linqable<TSource> {
        return new Linqable(new Iterables.Take<TSource>(this, count));
    }

    /**
     * Takes elements while they satisfy the provided predicate.
     * @param {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable of the taken elements.
     */
    takeWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Linqable(new Iterables.TakeWhile<TSource>(this, predicate));
    }

    /**
     * Filters the elements based on a predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable of the filtered elements.
     */
    where(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Linqable(new Iterables.Where<TSource>(this, predicate));
    }

    /**
     * Transforms the elements of the iterable into another value.
     * @param  {function} selector A function which transforms an element into another value.
     * @returns An iterable of the transformed elements.
     */
    select<TResult>(selector: (element: TSource) => TResult): Linqable<TResult> {
        return  new Linqable(new Iterables.Select<TSource, TResult>(this, selector));
    }

    /**
     * Flattens iterable elements into a single iterable sequence.
     * @param  {function} selector A function which transforms an element into another value.
     * @returns An iterable of the transformed elements.
     */
    selectMany<TResult>(selector: (element: TSource) => Iterable<TResult>): Linqable<TResult> {
        return  new Linqable(new Iterables.SelectMany<TSource, TResult>(this, selector));
    }

    /**
     * Applies a transformation function to each corresponding pair of elements from the iterables.
     * The paring ends when the shorter sequence ends, the remaining elements of the other sequence are ignored.
     * If a selector is not proviced the result will be an array of [left, right] array pairs.
     * @param  {Iterable<TRight>} right The second iterable.
     * @param  {function} selector A function witch transforms a pair of elements into another value.
     * @returns An iterable of the trasnformed values.
     */
    zip<TRight, TResult = [TSource, TRight]>(right: Iterable<TRight>, selector?: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
        return  new Linqable(new Iterables.Zip<TSource, TRight, TResult>(this, right, (selector || ((a, b) => [a, b])) as any));
    }

    /**
     * Takes the distinct elements based on the result of a selector function.
     * @param  {function} selector A function the result of which is used for comparing the elements in the iterable.
     * @returns An iterable of the distinct elements.
     */
    distinct(selector: (element: TSource) => any = (element: TSource) => element): Linqable<TSource> {
        return new Linqable(new Iterables.Distinct<TSource>(this, selector));
    }

    /**
     * Groups elements based on a selector function.
     * @param  {function} selector A function providing the key for the group.
     * @returns An iterable of groups.
     */
    groupBy<TKey>(selector: (element: TSource) => TKey): Linqable<[TKey, TSource[]]> {
        return new Linqable(new Iterables.Group<TKey, TSource>(this, selector));
    }

    /**
     * Orders elements based on a selector function.
     * @param  {function} comparer A function or a selector used for comparing the elements.
     * @returns An iterable of the ordered elements.
     */
    orderBy(comparer: ((element: TSource) => number | string)): Ordered<TSource> {
        return new Linqable(new Iterables.Ordered<TSource>(this, (left, right) => {
            let selector = comparer as (element: TSource) => number | string;
            let a = selector(left);
            let b = selector(right);

            if (a > b) return 1;
            
            if (a < b) return -1;

            return 0;
        }));
    }

    /**
     * Orders elements based on a selector function in desceding order.
     * @param  {function} selector A function or a selector used for comparing the elements.
     * @returns An iterable of the ordered elements.
     */
    orderByDescending(selector: ((element: TSource) => number | string)): Ordered<TSource> {
        return new Ordered<TSource>(this, (left, right) => {
            let a = selector(left);
            let b = selector(right);

            if (a > b) return -1;
            
            if (a < b) return 1;

            return 0;
        });
    }

    /**
     * Reverses the order of the sequence, e.g. reverse (1, 2, 3) -> (3, 2, 1)
     * @returns An iterable of the reversed squence of elements.
     */
    reverse(): Linqable<TSource> {
        return new Linqable(new Iterables.Reverse(this));
    }

    /**
     * Concatenates the sequences together.
     * @param  {Iterable<TSourse>} other The sequence that will be concatenated to the current sequence.
     * @returns An iterable of the concatenated elements.
     */
    concat(other: Iterable<TSource>): Linqable<TSource> {
        return new Linqable(new Iterables.Concat<TSource>(this, other));
    }

    /**
     * Reduces the sequence into a value.
     * @param  {TResult} seed A starting value.
     * @param  {function} accumulator An accumulator function.
     */
    aggregate<TResult>(seed: TResult, accumulator: (accumulated: TResult, element: TSource) => TResult) {
        let accumulated = seed;

        for (let element of this) {
            accumulated = accumulator(accumulated, element);
        }

        return accumulated;
    }

    /**
     * Gets the first element of the iterable.
     * @returns {TSource} The first element of the iterable.
     */
    first(): TSource {
        let iter = this[Symbol.iterator]();
        return iter.next().value;
    }

    /**
     * Gets the first element of the sequence. If a predicate is provided the first element matching the predicated will be returned.
     * If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.
     * @param  {function} predicate A predicate used for finding a matching element.
     * @param  {function} defaultInitializer A function returning default value if there aren't any matching elements.
     * @returns The first matching element or a default value.
     */
    firstOrDefault<TDefault>(predicate?: (element: TSource) => boolean, defaultInitializer: () => TDefault = () => undefined): TSource | TDefault {
        if (predicate) {
            for (let value of this) {
                if (predicate(value)) {
                    return value;
                }
            }

            return defaultInitializer();
        }
        else {
            let iter = this[Symbol.iterator]();
            let descriptor = iter.next();

            return descriptor.done ? defaultInitializer() : descriptor.value;
        }
    }

    /**
     * Gets the last element of the iterable.
     * @returns {TSource} The last element of the iterable.
     */
    last(): TSource {
        let last;
        for (let element of this) {
            last = element;
        }
        return last;
    }

    /**
     * Gets the last element of the sequence. If a predicate is provided the last element matching the predicated will be returned.
     * If there aren't any matching elements or if the sequence is empty a default value provided by the defaultInitializer will be returned.
     * @param  {function} predicate A predicate used for finding a matching element.
     * @param  {function} defaultInitializer A function returning default value if there aren't any matching elements.
     * @returns The last matching element or a default value.
     */
    lastOrDefault<TDefault>(predicate?: (element: TSource) => boolean, defaultInitializer: () => TDefault = () => undefined): TSource | TDefault {
        let last;
        let isFound = false;
        for (let value of this) {
            if (predicate) {
                if (predicate(value)) {
                    last = value;
                    isFound = true;
                }
            }
            else {
                last = value;
                isFound = true;
            }
        }

        return isFound ? last : defaultInitializer();
    }

    /**
     * Gets the max element in a sequence according to a transform function.
     * @param  {function} transform A function returning a primitive value used for copmaring elements in the sequence.
     * @returns TSource The max element of the sequence.
     */
    max(transform: (element: TSource) => number | string): TSource {
        let iterator = this[Symbol.iterator]();
        let iteratorResult = iterator.next();
        let bestMax = iteratorResult.value;
        let bestMaxPrimivie = transform(bestMax);

        while (!iteratorResult.done) {
            let value = iteratorResult.value;
            let currentPrimivie = transform(value);
            if (bestMaxPrimivie < currentPrimivie) {
                bestMax = value;
                bestMaxPrimivie = currentPrimivie;
            }
            iteratorResult = iterator.next();
        }

        return bestMax;
    }

    /**
     * Gets the min element in a sequence according to a transform function.
     * @param  {function} transform A function returning a primitive value used for copmaring elements in the sequence.
     * @returns TSource The min element of the sequence.
     */
    min(transform: (element: TSource) => number | string): TSource {
        let iterator = this[Symbol.iterator]();
        let iteratorResult = iterator.next();
        let bestMin = iteratorResult.value;
        let bestMinPrimivie = transform(bestMin);

        while (!iteratorResult.done) {
            let value = iteratorResult.value;
            let currentPrimivie = transform(value);
            if (bestMinPrimivie > currentPrimivie) {
                bestMin = value;
                bestMinPrimivie = currentPrimivie;
            }
            iteratorResult = iterator.next();
        }

        return bestMin;
    }

    /**
     *  
     * @param  {function} transform A function returning a number value used for summing elements in the sequence.
     * @returns TSource The average value of the sequence.
     */
    sum(selector: (element: TSource) => number): number {
        return this.aggregate(0, (acc, current) => acc + selector(current));
    }

    /**
     * Gets the averege value for a sequence.
     * @param  {function} transform A function returning a number value used for summing elements in the sequence.
     * @returns TSource The average value of the sequence.
     */
    average(transform: (element: TSource) => number): number {
        let sum = 0;
        let count = 0;

        for (let element of this) {
            sum += transform(element);
            count++;
        }

        let avg = sum / count;
        return avg;
    }

    /**
     * Tests the equality of two seuqneces by checking each corresponding pari of elements against the provided predicate.
     * If a predicate is not provided the elements will be compared using the strict equality (===) operator.
     * @param {Iterable<TRight>} right The sequence which will be compared to the current sequence.
     * @param {function} predicate A function that takes an element of each sequence compares them and returns a boolean depeneding whether they are considered equal or not. 
     * @returns {boolean} True if both sequences are of the same length and all corresponding pairs of elements are equal according to the predicate function. False otherwise.
     */
    sequenceEquals<TRight>(right: Iterable<TRight>, predicate: (left: TSource, right: TRight) => boolean = (left, right) => left as any === right): boolean {
        let sourceIterator = this[Symbol.iterator]();
        let rightIterator = right[Symbol.iterator]();

        let [sourceResult, rightResult] = [sourceIterator.next(), rightIterator.next()];

        while (!sourceResult.done && !rightResult.done) {

            if (!sourceResult.done && !rightResult.done && !predicate(sourceResult.value, rightResult.value)) {
                return false;
            }

            sourceResult = sourceIterator.next();
            rightResult = rightIterator.next();
        }

        return sourceResult.done && rightResult.done;
    }

    /**
     * Calls a function for each element of the sequence.
     * The function receives the element and its index in the seqeunce as parameters.
     * @param  {function} action A function called for each element of the sequence.
     */
    forEach(action: (element: TSource, index: number) => void): void {
        let index = 0;
        for (let element of this) {
            action(element, index);
            index++;
        }
    }

    /**
     * Gets the element at an index.
     * @param  {number} index The index of the element.
     */
    elementAt(index: number): TSource {
        return this.skip(index).take(1).first();
    }

    /**
     * Turns the sequence to an array.
     * @returns {TSource[]} An array of the sequence elements.
     */
    toArray(): TSource[] {
        let array = this.aggregate([], (acc, el) => {
            acc.push(el);
            return acc;
        });

        return array;
    }

    /**
     * Counts the number of elements in the sequence.
     * @returns {number} The number of elements in the sequence.
     */
    count(): number {
        let current = 0;

        for (let element of this) {
            current++;
        }

        return current;
    }

    /**
     * Excludes all elements of the provided sequence from the current sequence.
     * @param  {Iterable<TSource>} right The sequence of elements that will be excluded.
     * @returns {number} A sequence of the elements which are not present in the provided sequence.
     */
    except(right: Iterable<TSource>): Linqable<TSource> {
        return  new Linqable(new Iterables.Except<TSource>(this, right));
    }

    /**
     * Intersects the current sequence with the provided sequence.
     * @param  {Iterable<TSource>} right The sequence of elements that will be intersected with the current seqeunce.
     * @returns {number} A sequence of the elements which are present in both the provided sequences.
     */
    intersect(right: Iterable<TSource>): Linqable<TSource> {
        return new Intersect<TSource>(this, right);
    }

    /**
     * Performs a union operation on the current sequence and the provided sequence.
     * @param  {Iterable<TSource>} right The other sequence with which a union will be performed.
     * @returns {number} A sequence of the unique elements of both sequences.
     */
    union(right: Iterable<TSource>): Linqable<TSource> {
        return new Union<TSource>(this, right);
    }

    /**
     * Provides batches of elements from the sequence.
     * @param  {number} size The size of the batch.
     * @returns {Iterable<TSource[]>} A sequence of batches.
     */
    batch(size: number): Linqable<TSource[]> {
        const step = size;
        return new Windowed(this, size, step);
    }

    /**
     * Provides a sliding window of elements from the sequence.
     * @param  {number} size The size of the window.
     * @param  {number} step The number of elements to skip when sliding.
     * @returns {Iterable<TSource[]>} A sequence of windows.
     */
    windowed(size: number, step: number = 1): Linqable<TSource[]> {
        return new Windowed(this, size, step);
    }

    /**
     * Gets the index of the element in the sequence.
     * @param  {TSource} element 
     * @returns {number} The index of the element.
     */
    indexOf(element: TSource): number {
        let index = 0;

        for (let el of this) {
            if (el === element) {
                return index;
            }
            index++;
        }

        return -1;
    }
}

export class OrderedLinqable<TSource> extends Linqable<TSource> {
    static from((element: TSource) => string | number) {
        
    }
}