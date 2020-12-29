import { alinq } from './src/linq'

function getNumEvery(ms: number) {
  return alinq(async function* () {
    let i = 0
    while (true) {
      await new Promise(resolve => setTimeout(resolve, ms))
      yield i++
    }
  })
}


const squaredPlus100 =
  getNumEvery(1000)
    .zip(
      getNumEvery(1000).select(x => x.toString())
    )
    .tap(() => console.log(new Date()))
    .take(3);

(async function () {
  for await (const element of squaredPlus100) {
    console.log(element)
  }
})()

