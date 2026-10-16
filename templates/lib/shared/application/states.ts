export class State<T = unknown> {
    current: T

    public constructor(initial: T) {
        this.current = initial
    }

    public set(value: T) {
        this.current = value
        return this.current
    }

    public update(
        updater: (previous: T) => T
    ) {
        this.current = updater(this.current)
        return this.current
    }
}

export class AsyncState<T = unknown> {
    current: Promise<Awaited<T>>

    public constructor(initial: T) {
        this.current = Promise.resolve(initial)
    }

    public async set(value: T) {
        this.current = Promise.resolve(value)
        return await this.current
    }

    public async update(
        updater: (previous: Awaited<T>) => Awaited<T>
    ) {
        this.current = this.current.then(updater)
        return await this.current
    }
}
