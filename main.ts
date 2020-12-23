// import { id, linq, numberComparer, print, repeat, stringComparer } from './src/linq';
// import { comparerSymbol, EqualityComparer, Equtable as Equatable, Hashable } from './src/linq/linq-map/comparers';
// import { LinqMap } from './src/linq/linq-map/map';

import { linq } from './src/linq'
import { EqualityComparer, equalsSymbol, Equatable, getComparer, hashSymbol, numberComparer, objectComparer, stringComparer } from './src/linq/linq-map/comparers'
import { LinqMap } from './src/linq/linq-map/map'


class Key<TKey> implements Equatable<Key<TKey>> {
  private readonly _hash: number
  private readonly _comparer: EqualityComparer<TKey>

  constructor(public readonly key: TKey) {
    this._comparer = getComparer(key)
    this._hash = this._comparer.hash(this.key)
  }

  [hashSymbol](): number {
    return this._hash
  }
  [equalsSymbol](other: Key<TKey>): boolean {
    return this._comparer.equals(this.key, other.key)
  }
}

const count = 20000

const map = new LinqMap<string, { value: number }>(stringComparer)
const jsMap = new Map<string, { value: number }>()


// const keys: any[] = []
let total = 0
// let key: string
// for (let i = 0; i < count; i++) {
//   key = 'a'.repeat(i)
//   // console.log(key)
//   keys.push(key)
// }
console.time('jsMap set')

for (let i = 0; i < count; i++) {
  jsMap.set('a' + i, { value: i * 10 })
}

console.timeEnd('jsMap set')

console.time('jsMap get')
total = 0
for (let i = 0; i < count; i++) {
  total += jsMap.get('a' + i)?.value || 0
}
console.timeEnd('jsMap get')

console.log(total)

console.log('-'.repeat(50))


console.time('map set')


for (let i = 0; i < count; i++) {
  map.set('a' + i, { value: i * 10 })
}

console.timeEnd('map set')
console.time('map get')
total = 0
for (let i = 0; i < count; i++) {
  total += map.get('a' + i)?.value || 0
}

console.timeEnd('map get')
console.log(total)

function makeid(length) {
  let result = ''
  const characters = 'АБВГДЕЖЗИЙКЛМНОПРУСТФХЦЧШЩЪЬЮЯABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}