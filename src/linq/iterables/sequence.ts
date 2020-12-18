

export class Sequence {
    constructor(private start: number = 0,
        private step: number = 1,
        private end: number = Infinity) {
        if (!step) {
            throw Error("0 is not a valid step.");
        }
    }

    *[Symbol.iterator]() {
        const direction = this.step >= 0 ? 1 : -1;

        for (let i = this.start; this.end === Infinity || i * direction <= this.end * direction; i += this.step) {
            yield i;
        }
    }


    toString(): string {
        return `${Sequence.name} (start: ${this.start}, step: ${this.step}, end: ${this.end})`;
    }
}
