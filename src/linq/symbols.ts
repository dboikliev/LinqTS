export const elementsSymbol: unique symbol = Symbol();

export interface ElementsWrapper {
    [elementsSymbol](): Iterable<Iterable<any>>
}