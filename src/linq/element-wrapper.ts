export const elementsSymbol: unique symbol = Symbol();

export interface ElementsWrapper {
    [elementsSymbol](): Iterable<Iterable<any>>
}

export function isWrapper<T>(obj: ElementsWrapper | Iterable<T>): obj is ElementsWrapper {
    return typeof obj[elementsSymbol] === 'function';
}

export function unwrap<T>(obj: ElementsWrapper | Iterable<T>): Iterable<T> {
    if (isWrapper(obj)) {
        for (const elements of obj[elementsSymbol]()) {
            return elements;
        }
    }
    return obj as Iterable<T>;
}