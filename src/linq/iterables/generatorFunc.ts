export class GeneratorFunc<TSource> {
  constructor(private generator: (() => Generator<TSource>) | (() => AsyncGenerator<TSource>)) {
  }


  *[Symbol.iterator](): IterableIterator<TSource> {
    const generator = this.generator()
    if (typeof generator[Symbol.iterator] !== 'function') {
      throw Error('Missing @@iterator')
    }

    for (const element of generator as Generator<TSource>) {
      yield element
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TSource> {
    const generator = this.generator()
    let res = await generator.next()
    while (!res.done) {
      yield res.value
      res = await generator.next()
    }
  }


  toString(): string {
    return `${GeneratorFunc.name} (generator: ${this.generator})`
  }
}
