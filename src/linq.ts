export abstract class Linqable<TSource> implements Iterable<TSource> {
    abstract [Symbol.iterator](): Iterator<TSource>;

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
        return new Join<TSource, TRight, TResult>(this,
            right,
            leftSelector,
            rightSelector,
            resultSelector
        );
    }

    /**
     * Skips a specific number of elements.
     * @param  {number} count The number of elements to skip.
     * @returns An iterable with a beginning after the skipped values.
     */
    skip(count: number): Linqable<TSource> {
        return new Skip<TSource>(this, count);
    }

    /**
     * Skips elements while they satisfy the provided predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable with a beginning after the skipped values.
     */
    skipWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new SkipWhile<TSource>(this, predicate);
    }

    /**
     * Takes a specific number of elements.
     * @param  {number} count The number of elements to take.
     * @returns An iterable for the taken elements.
     */
    take(count: number): Linqable<TSource> {
        return new Take<TSource>(this, count);
    }

    /**
     * Takes elements while they satisfy the provided predicate.
     * @param {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable of the taken elements.
     */
    takeWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new TakeWhile<TSource>(this, predicate);
    }

    /**
     * Filters the elements based on a predicate.
     * @param  {function} predicate A predicate which the elements will be checked against.
     * @returns An iterable of the filtered elements.
     */
    where(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Where<TSource>(this, predicate);
    }

    /**
     * Transforms the elements of the iterable into another value.
     * @param  {function} selector A function which transforms an element into another value.
     * @returns An iterable of the transformed elements.
     */
    select<TResult>(selector: (element: TSource) => TResult): Linqable<TResult> {
        return new Select<TSource, TResult>(this, selector);
    }

    /**
     * Flattens iterable elements into a single iterable sequence.
     * @param  {function} selector A function which transforms an element into another value.
     * @returns An iterable of the transformed elements.
     */
    selectMany<TResult>(selector: (element: TSource) => Iterable<TResult>): Linqable<TResult> {
        return new SelectMany<TSource, TResult>(this, selector);
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
        return new Zip<TSource, TRight, TResult>(this, right, (selector || ((a, b) => [a, b])) as any);
    }

    /**
     * Takes the distinct elements based on the result of a selector function.
     * @param  {function} selector A function the result of which is used for comparing the elements in the iterable.
     * @returns An iterable of the distinct elements.
     */
    distinct(selector: (element: TSource) => any = (element: TSource) => element): Linqable<TSource> {
        return new Distinct<TSource>(this, selector);
    }

    /**
     * Groups elements based on a selector function.
     * @param  {function} selector A function providing the key for the group.
     * @returns An iterable of groups.
     */
    groupBy<TKey>(selector: (element: TSource) => TKey): Linqable<[TKey, TSource[]]> {
        return new Group<TKey, TSource>(this, selector);
    }

    /**
     * Orders elements based on a comparer or selector function.
     * @param  {function} comparer A function or a selector used for comparing the elements.
     * @returns An iterable of the ordered elements.
     */
    orderBy(comparer: ((first: TSource, second: TSource) => number) | ((element: TSource) => number | string)): Ordered<TSource> {
        if (comparer.length === 2) {
            return new Ordered<TSource>(this, comparer as (first: TSource, second: TSource) => number);
        }

        return new Ordered<TSource>(this, (left, right) => {
            let selector = comparer as (element: TSource) => number | string;
            let a = selector(left);
            let b = selector(right);

            if (a > b) {
                return 1;
            }
            else if (a === b) {
                return 0;
            }
            else {
                return -1;
            }
        });
    }

    /**
     * Concatenates the sequences together.
     * @param  {Iterable<TSourse>} other The sequence that will be concatenated to the current sequence.
     * @returns An iterable of the concatenated elements.
     */
    concat(other: Iterable<TSource>): Linqable<TSource> {
        return new Concat<TSource>(this, other);
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
        return new Except<TSource>(this, right);
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

class Windowed<TSource> extends Linqable<TSource[]> {
    private _source: Iterable<TSource>;
    private _size: number;
    private _step: number;

    constructor(source: Iterable<TSource>, size: number, step: number) {
        super();
        this._source = source;
        this._size = size;
        this._step = step;
    }

    *[Symbol.iterator]() {
        let window = [];

        let iterator = this._source[Symbol.iterator]();
        let current: IteratorResult<TSource>;
        for (let i = 0; i < this._size; i++) {
            current = iterator.next();
            if (current.done) {
                break;
            }
            window.push(current.value);
        }

        yield Array.from(window);

        current = iterator.next();
        while (current && !current.done) {
            let skipped = 0;
            while (skipped < this._step && window.length > 0) {
                window.shift();
                skipped++;
            }

            while (window.length < this._size) {
                if (skipped >= this._step) {
                    window.push(current.value);
                }
                else {
                    skipped++;
                }

                current = iterator.next();
                if (current.done) {
                    break;
                }
            }

            if (window.length === 0) {
                return;
            }

            yield Array.from(window);
        }
    }
}

class Except<TSource> extends Linqable<TSource> {
    private _left: Iterable<TSource>;
    private _right: Iterable<TSource>;

    constructor(left: Iterable<TSource>, right: Iterable<TSource>) {
        super();
        this._left = left;
        this._right = right;
    }

    *[Symbol.iterator]() {
        let set = new Set(this._right);
        for (let element of this._left) {
            if (!set.has(element)) {
                yield element;
            }
        }
    }
}

class Intersect<TSource> extends Linqable<TSource> {
    private _left: Iterable<TSource>;
    private _right: Iterable<TSource>;

    constructor(left: Iterable<TSource>, right: Iterable<TSource>) {
        super();
        this._left = left;
        this._right = right;
    }

    *[Symbol.iterator]() {
        let set = new Set(this._right);
        for (let element of this._left) {
            if (set.has(element)) {
                yield element;
            }
        }
    }
}

class Union<TSource> extends Linqable<TSource> {
    private _left: Iterable<TSource>;
    private _right: Iterable<TSource>;

    constructor(left: Iterable<TSource>, right: Iterable<TSource>) {
        super();
        this._left = left;
        this._right = right;
    }

    *[Symbol.iterator]() {
        let set = new Set(this._left);

        for (let element of set) {
            yield element;
        }

        for (let element of this._right) {
            if (!set.has(element)) {
                set.add(element);
                yield element;
            }
        }
    }
}

class Skip<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _count: number;

    constructor(elements: Iterable<TSource>, count: number) {
        super();
        this._elements = elements;
        this._count = count;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let iterator = this._elements[Symbol.iterator]();
        let iteratorResult: IteratorResult<TSource> = iterator.next();
        for (let i = 0; i < this._count && !iteratorResult.done; i++) {
            iteratorResult = iterator.next();
        }

        while (!iteratorResult.done) {
            yield iteratorResult.value;
            iteratorResult = iterator.next();
        }
    }
}

class SkipWhile<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        super();
        this._elements = elements;
        this._predicate = predicate;
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iterator = this._elements[Symbol.iterator]();

        let lastResult;
        do {
            lastResult = iterator.next();
        } while (this._predicate(lastResult.value));

        return {
            next: (): IteratorResult<TSource> => {
                if (lastResult) {
                    let copy = lastResult;
                    lastResult = undefined;
                    return copy;
                }

                let iteratorResult = iterator.next();
                let result: IteratorResult<TSource> = {
                    value: iteratorResult.value,
                    done: iteratorResult.done
                };
                return result;
            }
        };
    }
}

class Take<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _count: number;

    constructor(elements: Iterable<TSource>, count: number) {
        super();
        this._elements = elements;
        this._count = count;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let current = 0;
        for (let element of this._elements) {
            if (current >= this._count) {
                return;
            }
            current++;
            yield element;
        }
    }
}

class TakeWhile<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        super();
        this._elements = elements;
        this._predicate = predicate;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this._elements) {
            if (!this._predicate(element)) {
                break;
            }
            yield element;
        }
    }
}

class Distinct<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => any;

    constructor(elements: Iterable<TSource>, selector?: (element: TSource) => any) {
        super();
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let map = new Map();
        for (let element of this._elements) {
            let key = this._selector(element);

            if (!map.has(key)) {
                map.set(key, element);
                yield element;
            }
        }
    }
}

class List<TSource> extends Linqable<TSource> {
    private _elements: Iterable<any>;

    constructor(elements: Iterable<any>) {
        super();
        this._elements = elements;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        yield* this._elements;
    }
}

class Zip<TLeft, TRight, TResult> extends Linqable<TResult> {
    private _selector: (left: TLeft, right: TRight) => TResult;
    private _left: Iterable<TLeft>;
    private _right: Iterable<TRight>;

    constructor(left: Iterable<TLeft>, right: Iterable<TRight>, selector: (left: TLeft, right: TRight) => TResult) {
        super();
        this._left = left;
        this._right = right;
        this._selector = selector;
    }

    [Symbol.iterator](): Iterator<TResult> {
        let iterLeft = this._left[Symbol.iterator]();
        let iterRight = this._right[Symbol.iterator]();

        return {
            next: (): IteratorResult<TResult> => {
                let iterationLeft = iterLeft.next();
                let iterationRight = iterRight.next();

                let isDone = iterationLeft.done || iterationRight.done;
                let zip;
                if (!isDone) {
                    zip = this._selector(iterationLeft.value, iterationRight.value);
                }

                let result: IteratorResult<TResult> = {
                    value: zip,
                    done: isDone
                };

                return result;
            }
        };
    }
}

class Where<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        super();
        this._elements = elements;
        this._predicate = predicate;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        for (let element of this._elements) {
            if (this._predicate(element)) {
                yield element;
            }
        }
    }
}

class Select<TSource, TResult> extends Linqable<TResult> {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => TResult;

    constructor(elements: Iterable<TSource>, selector: (element: TSource) => TResult) {
        super();
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this._elements) {
            yield this._selector(element);
        }
    }
}

class SelectMany<TSource, TResult> extends Linqable<TResult> {
    private _elements: Iterable<TSource>;
    private _selector: (element: TSource) => Iterable<TResult>;

    constructor(elements: Iterable<TSource>, selector: (element: TSource) => Iterable<TResult>) {
        super();
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<TResult> {
        for (let element of this._elements) {
            let innerElements = this._selector(element);
            yield* innerElements;
        }
    }
}

class Group<TKey, TValue> extends Linqable<[TKey, TValue[]]> {
    private _elements: Iterable<TValue>;
    private _selector: (element: TValue) => any;

    constructor(elements: Iterable<TValue>, selector: (element: TValue) => TKey) {
        super();
        this._elements = elements;
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<[TKey, TValue[]]> {
        let groups = new Map<TKey, TValue[]>();

        for (let element of this._elements) {
            let key = this._selector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        yield* groups;
    }
}

class Join<TLeft, TRight, TResult> extends Linqable<TResult> {
    private _leftElements: Iterable<TLeft>;
    private _rightElements: Iterable<TRight>;
    private _leftSelector: (element: TLeft) => any;
    private _rightSelector: (element: TRight) => any;
    private _resultSelector: (left: TLeft, right: TRight) => TResult;

    constructor(leftElements: Iterable<TLeft>,
        rightElements: Iterable<TRight>,
        leftSelector: (element: TLeft) => any,
        rightSelector: (element: TRight) => any,
        resultSelector: (left: TLeft, right: TRight) => TResult) {
        super();
        this._leftElements = leftElements;
        this._rightElements = rightElements;
        this._leftSelector = leftSelector;
        this._rightSelector = rightSelector;
        this._resultSelector = resultSelector;
    }

    *[Symbol.iterator](): Iterator<TResult> {
        let groups = new Map<any, TRight[]>();

        for (let element of this._rightElements) {
            let key = this._rightSelector(element);
            let group = groups.get(key) || [];
            group.push(element);
            groups.set(key, group);
        }

        for (let left of this._leftElements) {
            let leftKey = this._leftSelector(left);
            let group = groups.get(leftKey) || [];

            for (let match of group) {
                yield this._resultSelector(left, match);
            }
        }
    }
}

class Ordered<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _comparer: (first: TSource, second: TSource) => number;

    constructor(elements: Iterable<TSource>, comparer: (first: TSource, second: TSource) => number) {
        super();
        this._elements = elements;
        this._comparer = comparer;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let elements = [];

        for (let element of this._elements) {
            elements.push(element);
        }

        elements.sort(this._comparer);

        yield* elements;
    }

    thenBy(selector: (elemment: TSource) => number | string): Ordered<TSource> {
        return new Ordered(this._elements, (first, second) => {
            let firstComparison = this._comparer(first, second);

            if (firstComparison === 0) {
                return this.compareWithSelector(first, second, selector);
            }
            return firstComparison;
        });
    }

    thenByDescending(selector: (elemment: TSource) => number | string): Ordered<TSource> {
        return new Ordered(this._elements, (first, second) => {
            let firstComparison = this._comparer(first, second);

            if (firstComparison === 0) {
                return this.compareWithSelector(second, first, selector);
            }
            return firstComparison;
        });
    }

    private compareWithSelector(first: TSource, second: TSource, selector: (element: TSource) => number | string): number {
        let a = selector(first);
        let b = selector(second);
        if (a > b) {
            return 1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return -1;
        }
    }
}


class Concat<TSource> extends Linqable<TSource> {
    private _first: Iterable<TSource>;
    private _second: Iterable<TSource>;

    constructor(first: Iterable<TSource>, second: Iterable<TSource>) {
        super();
        this._first = first;
        this._second = second;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        yield* this._first;
        yield* this._second;
    }
}

/**
 * Wraps an interable into an object which supports LINQ queries.
 * @param {Iterable<T>} iterable The sequence which will be queried.
 * @returns {Linqable<number>} An object with support for LINQ queries.
 */
export function linq<T>(iterable: Iterable<T> | number | string | object): Linqable<T> {
    return new List<T>(iterable as Iterable<T>);
}

/**
 * Generates a sequence of numbers from start to end (if specified), increasing by the speficied step.
 * @param  {number} start The beginning of the sequence. 0 by default.
 * @param  {number} step The ammount to increment by on each iteration. 1 by default.
 * @param  {number} end The end of the sequence. Infinity by default.
 * @returns {Linqable<number>}
 */
export function seq(start: number = 0, step: number = 1, end: number = Infinity): Linqable<number> {
    return linq({
        *[Symbol.iterator]() {
            for (let i = start; end === Infinity || i <= end; i += step) {
                yield i;
            }
        }
    });
}

/**
 * The identity function (x => x). It takes an element and returns it.
 * @param  {T} element The element to return.
 * @returns {T} The element which was passed as a parameter.
 */
export function id<T>(element: T): T {
    return element;
}