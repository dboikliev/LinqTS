export abstract class Linqable<TSource> implements Iterable<TSource> {
    abstract [Symbol.iterator](): Iterator<TSource>;

    /**
     * Checks if any of the elements match the provided predicate.
     * @param {function} predicate A predicate which the elements will be checked against.
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

    skip(count: number): Linqable<TSource> {
        return new Skip<TSource>(this, count);
    }

    skipWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new SkipWhile<TSource>(this, predicate);
    }

    take(count: number): Linqable<TSource> {
        return new Take<TSource>(this, count);
    }

    takeWhile(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new TakeWhile<TSource>(this, predicate);
    }

    where(predicate: (element: TSource) => boolean): Linqable<TSource> {
        return new Where<TSource>(this, predicate);
    }

    select<TResult>(selector: (element: TSource) => TResult): Linqable<TResult> {
        return new Select<TSource, TResult>(this, selector);
    }

    selectMany<TResult>(selector: (element: TSource) => Iterable<TResult>): Linqable<TResult> {
        return new SelectMany<TSource, TResult>(this, selector);
    }

    zip<TRight, TResult>(right: Iterable<TRight>, selector: (left: TSource, right: TRight) => TResult): Linqable<TResult> {
        return new Zip<TSource, TRight, TResult>(this, right, selector);
    }

    distinct(selector: (element: TSource) => any = (element: TSource) => element): Linqable<TSource> {
        return new Distinct<TSource>(this, selector);
    }

    groupBy<TKey>(selector: (element: TSource) => TKey): Linqable<[TKey, TSource[]]> {
        return new Group<TKey, TSource>(this, selector);
    }

    orderBy(comparer: (first: TSource, second: TSource) => number): Ordered<TSource> {
        return new Ordered<TSource>(this, comparer);
    }

    aggregate<TResult>(seed: TResult, accumulator: (accumulated: TResult, element: TSource) => TResult) {
         let accumulated = seed;

         for (let element of this) {
            accumulated = accumulator(accumulated, element);
         }

         return accumulated;
    }

    first(): TSource {
        let iter = this[Symbol.iterator]();
        return iter.next().value;
    }

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

    maxBy(transform: (element: TSource) => number | string): TSource {
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

    minBy(transform: (element: TSource) => number | string): TSource {
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

    averageBy(transform: (element: TSource) => number): number {
        let sum = 0;
        let count = 0;

        for (let element of this) {
            sum += transform(element);
            count++;
        }

        let avg = sum / count;
        return avg;
    }

    forEach(action: (element: TSource, index: number) => void): void {
        let index = 0;
        for (let element of this) {
            action(element, index);
            index++;
        }
    }

    elementAt(index: number): TSource {
        return this.skip(index).take(1).first();
    }

    toArray(): TSource[] {
        let array: TSource[] = [];

        this.aggregate(array, (acc, el) => {
            acc.push(el);
            return acc;
        });

        return array;
    }

    count(): number {
        let current = 0;

        for (let element of this) {
            current++;
        }

        return current;
    }
}

class Skip<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _count: number;

    constructor(elements: Iterable<TSource>, count: number) {
        super();
        this._elements = elements
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
        this._elements = elements
        this._predicate = predicate;
    }

    [Symbol.iterator](): Iterator<TSource> {
        let iterator = this._elements[Symbol.iterator]();

        let lastResult;
        do {
            lastResult = iterator.next();
        } while(this._predicate(lastResult.value));

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
        }
    }
}

class Take<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _count: number;

    constructor(elements: Iterable<TSource>, count: number) {
        super();
        this._elements = elements
        this._count = count;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let current = 0;
        for (let element of this._elements) {
            if (current >= this._count) {
                break;
            }
            yield element;
            current++;
        }
    }
}

class TakeWhile<TSource> extends Linqable<TSource> {
    private _elements: Iterable<TSource>;
    private _predicate: (element: TSource) => boolean;

    constructor(elements: Iterable<TSource>, predicate: (element: TSource) => boolean) {
        super();
        this._elements = elements
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
        this._elements = elements
        this._selector = selector;
    }

    *[Symbol.iterator](): Iterator<TSource> {
        let map = new Map();
        let iterator = this._elements[Symbol.iterator]();
        let iteratorResult = iterator.next();
        while (!iteratorResult.done) {
            let key = this._selector(iteratorResult.value);

            if (map.has(key)) {
                iteratorResult = iterator.next();
            }
            else {
                map.set(key, iteratorResult.value);
            }
        }

        yield* map.values();
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
            let innerElements = this._selector(element)
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
}

export function linq<T>(iterable: Iterable<T>): Linqable<T> {
    return new List<T>(iterable);
}

export function range(start: number = 0, step: number = 1, end: number = Infinity): Linqable<number> {
    return linq({
        *[Symbol.iterator]() {
            for (let i = start; end == Infinity || i <= end; i += step) {
                yield i;
            }
        }
    });
}