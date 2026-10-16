export class State<T = unknown> {
    current: Promise<Awaited<T>>

    constructor(initial: T) {
        this.current = Promise.resolve(initial)
    }

    set(value: T) {
        this.current = Promise.resolve(value)
        return this.current
    }

    update(
        onfulfilled: (previous: Awaited<T>) => Awaited<T>,
        onrejected: undefined | ((reason: unknown) => Awaited<T>)
    ) {
        this.current = this.current.then(onfulfilled, onrejected)
        return this.current
    }
}
