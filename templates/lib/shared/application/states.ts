export class State<T = unknown> {
    current: Promise<Awaited<T>>

    public constructor(initial: T) {
        this.current = Promise.resolve(initial)
    }

    public set(value: T) {
        this.current = Promise.resolve(value)
        return this.current
    }

    public update(
        onfulfilled: (previous: Awaited<T>) => Awaited<T>
    ) {
        this.current = this.current.then(onfulfilled)
        return this.current
    }
}
