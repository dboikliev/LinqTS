
const view = new DataView(new ArrayBuffer(8))
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

export const numberComparer: EqualityComparer<number> = {
  hash(key: number): number {
    if (Number.isInteger(key)) {
      return key
    }

    view.setFloat64(0, key)
    return Math.abs(view.getInt32(0) ^ view.getInt32(4)) | 0
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
    let hash = 212984747

    for (let i = 0, length = key.length; i < length; i++) {
      hash = Math.imul(33, hash) ^ key.charCodeAt(i)
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

    let hash = 0
    switch (typeof key) {
    case 'number':
      hash ^= numberComparer.hash(key)
      break
    case 'string':
      hash ^= stringComparer.hash(key)
      break
    case 'boolean':
      hash ^= booleanComparer.hash(key)
      break
    case 'object':
      for (const prop in key) {
        hash ^= objectComparer.hash(key[prop])
      }
      if (key[Symbol.iterator]) {
        hash ^= iterableComparer.hash(key as IterableIterator<unknown>)
      }
      break
    }

    return Math.abs(hash | 0)
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
      hash ^= objectComparer.hash(element)
    }

    return Math.abs(hash | 0)
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

function isEquatable(obj: unknown): obj is Equatable<unknown> {
  return typeof obj[hashSymbol] === 'function' && typeof obj[equalsSymbol] === 'function'
}

export function getComparer<T>(key: T): EqualityComparer<T> {
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
}