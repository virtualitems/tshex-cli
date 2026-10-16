const SET_ACTION = 'set_action'

const UPDATE_ACTION = 'update_action'

type StateAction = typeof SET_ACTION | typeof UPDATE_ACTION

type StateUpdater<T> = (previousValue: T) => T

type StateEvent<T> =
    | {
        action: typeof SET_ACTION
        details: [T]
    }
    | {
        action: typeof UPDATE_ACTION
        details: [StateUpdater<T>]
    }

export class State<T> {
    private valueState: T
    private queue: StateEvent<T>[] = []

    public constructor(value: T) {
        this.valueState = value
    }

    public get value(): T {
        return this.valueState
    }

    public set(value: T): void {
        this.schedule(SET_ACTION, value)
    }

    public update(updater: StateUpdater<T>): void {
        if (typeof updater !== 'function') {
            throw new TypeError('Updater must be a function')
        }

        this.schedule(UPDATE_ACTION, updater)
    }

    private consume(): void {
        while (this.queue.length > 0) {
            const item = this.queue[0]
            const { action, details } = item

            switch (action) {
                case SET_ACTION: {
                    this.valueState = details[0]
                    break
                }

                case UPDATE_ACTION: {
                    const updater = details[0]
                    this.valueState = updater(this.valueState)
                    break
                }

                default:
                    throw new TypeError('Unknown state action')
            }

            this.queue.shift()
        }
    }

    private schedule(
        action: StateAction,
        ...details: [T] | [StateUpdater<T>]
    ): void {
        this.queue.push({ action, details } as StateEvent<T>)

        if (this.queue.length === 0) {
            this.consume()
        }
    }
}
