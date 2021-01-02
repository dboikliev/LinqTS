export type UnfoldStep<TState, TResult> = { result: TResult, newState: TState }

export class Unfold<TState, TResult> {
  constructor(private readonly initialState: TState,
    private readonly generator: (state: TState) => UnfoldStep<TState, TResult> | Promise<UnfoldStep<TState, TResult>>, 
    private readonly breakWhen: (state: TState) => boolean | Promise<boolean>) {
  }

  *[Symbol.iterator](): IterableIterator<TResult> {
    let next = this.generator(this.initialState) as UnfoldStep<TState, TResult>
    while (!this.breakWhen(next.newState)) {
      yield next.result
      next = this.generator(next.newState) as UnfoldStep<TState, TResult>
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<TResult> {
    let next = await this.generator(this.initialState)
    while (!await this.breakWhen(next.newState)) {
      yield next.result
      next = await this.generator(next.newState)
    }
  }

  toString(): string {
    return `${Unfold.name} (generator: ${this.generator})`
  }
}
