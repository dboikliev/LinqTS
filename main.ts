import { CachedKey, numberComparer } from './src/linq/collections/comparers'
import { LinqMap } from './src/linq/collections/map'



const count = 1000000

type TKey = number
type StripCache<T> = T extends CachedKey<infer U> ? U : T
const map = new LinqMap<TKey, { value: number }>(numberComparer)
const jsMap = new Map<StripCache<TKey>, { value: number }>()


const keys: TKey[] = []
let total = 0
let key: TKey
for (let i = 0; i < count; i++) {
  key = i
  // console.log(key)
  keys.push(key)
}
console.time('jsMap set')

for (let i = 0; i < count; i++) {
  jsMap.set(keys[i], { value: i * 10 })
}

console.timeEnd('jsMap set')

console.time('jsMap get')
total = 0
for (let i = 0; i < count; i++) {
  total += jsMap.get(keys[i]).value
}
console.timeEnd('jsMap get')

function makeid(length) {
  let result = ''
  const characters = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
console.log(total)

console.log('-'.repeat(50))


console.time('map set')


for (let i = 0; i < count; i++) {
  map.set(keys[i], { value: i * 10 })
}

console.timeEnd('map set')

// console.log(Array.from(map.entries()))


console.time('map get')
total = 0
for (let i = 0; i < count; i++) {
  total += map.get(keys[i]).value
}

console.timeEnd('map get')
console.log(total)
