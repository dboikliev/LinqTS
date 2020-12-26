
export const hashSymbol: unique symbol = Symbol()
export const equalsSymbol: unique symbol = Symbol()

export interface Equatable<T> {
  [hashSymbol](): number
  [equalsSymbol](other: T): boolean
}

export type HashFunction<T> = (key: T) => number
export type EqualsFunction<T> = (first: T, second: T) => boolean

export interface EqualityComparer<TKey> {
  hash: HashFunction<TKey>
  equals: EqualsFunction<TKey>
}

const _view = new DataView(new ArrayBuffer(8))

export const numberComparer: EqualityComparer<number> = {
  hash(key: number): number {
    if (Number.isInteger(key)) {
      return key >>> 0
    }

    _view.setFloat64(0, key)
    const hash = ((_view.getUint32(0) * 397 + _view.getUint32(4))) >>> 0
    return hash
  },

  equals(first: number, second: number): boolean {
    return first === second
  }
}

export const booleanComparer: EqualityComparer<boolean> = {
  hash(key: boolean): number {
    return Number(key)
  },

  equals(first: boolean, second: boolean): boolean {
    return first === second
  }
}

export const stringComparer: EqualityComparer<string> = {
  hash(key: string): number {
    let hash = 0

    for (let i = 0, length = key.length; i < length; i++) {
      hash = 397 * hash + key.charCodeAt(i) | 0
    }
    return hash >>> 0
  },

  equals(first: string, second: string): boolean {
    return first === second
  }
}

export const objectComparer: EqualityComparer<unknown> = {
  hash(key: unknown): number {
    if (isEquatable(key)) {
      return key[hashSymbol]()
    }
    // TODO: add handling for Symbol and Function
    let hash = 0
    switch (typeof key) {
    case 'number':
      hash += numberComparer.hash(key) * 31
      break
    case 'string':
      hash += stringComparer.hash(key) * 33
      break
    case 'boolean':
      hash += booleanComparer.hash(key) * 397
      break
    case 'object':
      for (const prop in key) {
        hash += objectComparer.hash(key[prop]) * 3
      }
      if (key[Symbol.iterator]) {
        hash += iterableComparer.hash(key as IterableIterator<unknown>) * 7
      }
      break
    }

    return hash >>> 0
  },

  equals(first: unknown, second: unknown): boolean {
    if (isEquatable(first)) {
      return first[equalsSymbol](second)
    }

    if (isEquatable(second)) {
      return second[equalsSymbol](first)
    }

    if (typeof first !== typeof second) {
      return false
    }

    // TODO: add handling for Symbol and Function
    let equal = true
    switch (typeof first) {
    case 'number':
      equal &&= numberComparer.equals(first, second as number)
      break
    case 'string':
      equal &&= stringComparer.equals(first, second as string)
      break
    case 'boolean':
      equal &&= booleanComparer.equals(first, second as boolean)
      break
    case 'object':
      // TODO: handle properies from second missing in first
      for (const prop in first) {
        equal &&= objectComparer.equals(first[prop], second[prop])
      }
      if (equal && first[Symbol.iterator] && second[Symbol.iterator]) {
        equal &&= iterableComparer.equals(first as IterableIterator<unknown>, second as IterableIterator<unknown>)
      }
      break
    }

    return equal
  }
}

export const iterableComparer: EqualityComparer<IterableIterator<unknown>> = {
  hash(key: Iterable<unknown>): number {
    let hash = 0

    for (const element of key) {
      hash = 31 * objectComparer.hash(element) * hash | 0
    }

    return hash >>> 0
  },

  equals(first: IterableIterator<unknown>, second: IterableIterator<unknown>): boolean {
    let equal = true
    const firstIt: IterableIterator<unknown> = first[Symbol.iterator]()
    const secondIt: IterableIterator<unknown> = second[Symbol.iterator]()
    let firstRes = firstIt.next()
    let secondRes = secondIt.next()
    while (!firstRes.done && !secondRes.done) {
      equal &&= objectComparer.equals(firstRes.value, secondRes.value)

      if (!equal) {
        return false
      }

      firstRes = firstIt.next()
      secondRes = secondIt.next()
    }

    equal &&= firstRes.done && secondRes.done
    return equal
  }
}

export function getComparer<T>(key: T): EqualityComparer<T> {
  // TODO: handle Symbol and Function
  switch (typeof key) {
  case 'number':
    return numberComparer as never
  case 'string':
    return stringComparer as never
  case 'boolean':
    return booleanComparer as never
  case 'object':
    return objectComparer
  }
  throw Error(`Type "${typeof key}" is not supported.`)
}

export class CachedKey<TKey> implements Equatable<CachedKey<TKey>> {
  readonly hash: number
  readonly comparer: EqualityComparer<TKey>

  constructor(public readonly key: TKey) {
    this.comparer = getComparer(key)
    this.hash = this.comparer.hash(this.key)
  }

  [hashSymbol](): number {
    return this.hash
  }
  [equalsSymbol](other: CachedKey<TKey>): boolean {
    return this.comparer.equals(this.key, other.key)
  }
}

function isEquatable(obj: unknown): obj is Equatable<unknown> {
  return typeof obj[hashSymbol] === 'function' && typeof obj[equalsSymbol] === 'function'
}