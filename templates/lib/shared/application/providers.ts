/**
 * Restricts every dependency declared in a map to an object instance.
 */
export type DependencyMap<T> = {
    [Token in keyof T]: object
}

/**
 * Represents a string token from a dependency map.
 */
type DependencyToken<T> = Extract<keyof T, string>

/**
 * Resolves registered dependency instances inside one dependency graph.
 */
export interface DependencyResolver<T extends DependencyMap<T>> {
    /**
     * Resolves one dependency instance by token.
     *
     * @param token - Dependency token of type `Token`.
     * @returns The dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    resolve<Token extends DependencyToken<T>>(token: Token): T[Token]
}

/**
 * Creates one dependency instance through a resolver.
 */
type Factory<
    Dependencies extends DependencyMap<Dependencies>,
    Token extends DependencyToken<Dependencies> = DependencyToken<Dependencies>
> = (resolver: DependencyResolver<Dependencies>) => Dependencies[Token]

/**
 * Defines the factory associated with one dependency token.
 */
interface Registration<
    Dependencies extends DependencyMap<Dependencies>,
    Token extends DependencyToken<Dependencies>
> {
    readonly factory: Factory<Dependencies, Token>
}

/**
 * Stores a dependency factory and its resolved singleton instance.
 */
interface ContainerEntry<T extends DependencyMap<T>> {
    readonly factory: Factory<T>
    readonly instance: T[DependencyToken<T>] | null
}

/**
 * Stores dependency entries in an object without a prototype.
 */
interface ContainerEntries<T extends DependencyMap<T>> {
    [token: string]: ContainerEntry<T> | undefined
}

/**
 * Represents one normalized registration entry.
 */
type RegistrationEntry<T extends DependencyMap<T>> = [
    DependencyToken<T>,
    Registration<T, DependencyToken<T>>
]

/**
 * Represents one resolved container entry.
 */
type ResolvedEntry<T extends DependencyMap<T>> = [DependencyToken<T>, ContainerEntry<T>]

/**
 * Maps dependency tokens to their factories.
 */
export type Registrations<T extends DependencyMap<T>> = Partial<{
    [Token in DependencyToken<T>]: Registration<T, Token>
}>

/**
 * Reports a circular dependency and the complete cycle path.
 */
export class CircularDependencyError extends Error {
    /**
     * Creates a circular dependency error.
     *
     * @param path - Dependency cycle path of type `string[]`.
     */
    constructor(path: string[]) {
        const pathText = path.join(' -> ')
        const message = `Circular dependency detected: ${pathText}`

        super(message)
        this.name = 'CircularDependencyError'
    }
} //:: CircularDependencyError

/**
 * Resolves one dependency graph without committing partial results.
 */
class Resolver<T extends DependencyMap<T>> implements DependencyResolver<T> {
    private readonly stack: DependencyToken<T>[] = []

    private readonly stateEntries: ContainerEntries<T> = Object.create(
        null
    ) as ContainerEntries<T>

    private readonly table: Readonly<ContainerEntries<T>>

    /**
     * Creates a resolver over a dependency table.
     *
     * @param table - Dependency table stored in an object without a prototype.
     */
    constructor(table: Readonly<ContainerEntries<T>>) {
        this.table = table
    }

    /**
     * Returns dependencies resolved during the current graph resolution.
     *
     * @returns A readonly object containing resolved dependency entries.
     */
    get state(): Readonly<ContainerEntries<T>> {
        return this.stateEntries
    }

    /**
     * Resolves one dependency instance by token.
     *
     * @param token - Dependency token of type `Token`.
     * @returns The dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    resolve<Token extends DependencyToken<T>>(token: Token): T[Token] {
        const stateEntry = this.stateEntries[token]

        if (stateEntry !== undefined) {
            if (stateEntry.instance === null) {
                const path = this.circularPath(token)

                throw new CircularDependencyError(path)
            }

            return stateEntry.instance as T[Token]
        }

        const entry = this.table[token]

        if (entry === undefined) {
            const message = `Token ${token} is not registered`

            throw new Error(message)
        }

        if (entry.instance !== null) {
            this.stateEntries[token] = entry

            return entry.instance as T[Token]
        }

        const pendingEntry: ContainerEntry<T> = {
            factory: entry.factory,
            instance: null
        }

        this.stateEntries[token] = pendingEntry
        this.stack.push(token)

        try {
            const instance = entry.factory(this) as T[Token]
            const resolvedEntry: ContainerEntry<T> = {
                factory: entry.factory,
                instance
            }

            this.stateEntries[token] = resolvedEntry

            return instance
        } finally {
            this.stack.pop()
        }
    }

    /**
     * Builds the dependency path that closes a cycle.
     *
     * @param token - Repeated dependency token of type `DependencyToken`.
     * @returns The complete circular path as a `string[]`.
     */
    private circularPath(token: DependencyToken<T>): string[] {
        const index = this.stack.indexOf(token)
        const path = [...this.stack.slice(index), token]

        return path
    }
} //:: Resolver

/**
 * Stores dependency factories and resolves lazy singleton instances.
 *
 * Mutating operations are serialized through an asynchronous write lock so
 * concurrent callers cannot create or commit conflicting singleton state.
 */
export class Container<T extends DependencyMap<T>> {
    protected readonly entries: ContainerEntries<T> = Object.create(
        null
    ) as ContainerEntries<T>

    private isWriteLocked: boolean = false

    private readonly writeWaiters: (() => void)[] = []

    /**
     * Registers dependency factories as one serialized atomic operation.
     *
     * @param entries - Dependency registrations of type `Registrations`.
     * @returns A promise containing the current `Container` instance.
     * @throws {Error} When any token is already registered.
     */
    async register(entries: Registrations<T>): Promise<this> {
        const operation = (): this => {
            const registrations = Object.entries(entries) as RegistrationEntry<T>[]

            for (const [token] of registrations) {
                const isRegistered = this.has(token)

                if (isRegistered === true) {
                    const message = `Token ${token} is already registered`

                    throw new Error(message)
                }
            }

            for (const [token, registration] of registrations) {
                const entry: ContainerEntry<T> = {
                    factory: registration.factory,
                    instance: null
                }

                this.entries[token] = entry
            }

            return this
        }

        const container = await this.withWriteLock(operation)

        return container
    }

    /**
     * Resolves and commits one dependency graph as a serialized operation.
     *
     * Holding the write lock across construction prevents concurrent calls from
     * creating more than one singleton for the same unresolved token.
     *
     * @param token - Dependency token of type `Token`.
     * @returns A promise containing the dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    async resolve<Token extends DependencyToken<T>>(token: Token): Promise<T[Token]> {
        const operation = (): T[Token] => {
            const resolver = new Resolver<T>(this.entries)
            const instance = resolver.resolve(token)
            const resolvedEntries = Object.entries(resolver.state) as ResolvedEntry<T>[]

            for (const [key, value] of resolvedEntries) {
                this.entries[key] = value
            }

            return instance
        }

        const instance = await this.withWriteLock(operation)

        return instance
    }

    /**
     * Reports whether a dependency token is currently registered.
     *
     * Callers that depend on a preceding asynchronous mutation must await that
     * mutation before reading the container.
     *
     * @param token - Dependency token of type `DependencyToken`.
     * @returns A `boolean` indicating whether the token is registered.
     */
    has(token: DependencyToken<T>): boolean {
        const entry = this.entries[token]
        const isRegistered = entry !== undefined

        return isRegistered
    }

    /**
     * Removes a registered dependency token as a serialized operation.
     *
     * This operation does not invalidate dependent singleton instances that are
     * already resolved and cached.
     *
     * @param token - Dependency token of type `DependencyToken`.
     * @returns A promise containing whether a registration was removed.
     */
    async unregister(token: DependencyToken<T>): Promise<boolean> {
        const operation = (): boolean => {
            const isRegistered = this.has(token)

            if (isRegistered === false) {
                return false
            }

            delete this.entries[token]

            return true
        }

        const isRemoved = await this.withWriteLock(operation)

        return isRemoved
    }

    /**
     * Removes every dependency registration and cached instance serially.
     *
     * @returns A promise that resolves after the container is cleared.
     */
    async clear(): Promise<void> {
        const operation = (): void => {
            const tokens = Object.keys(this.entries)

            for (const token of tokens) {
                delete this.entries[token]
            }
        }

        await this.withWriteLock(operation)
    }

    /**
     * Acquires the asynchronous write lock in first-in, first-out order.
     *
     * @returns A promise that resolves after exclusive write access is acquired.
     */
    private async acquireWriteLock(): Promise<void> {
        const isAvailable = this.isWriteLocked === false

        if (isAvailable === true) {
            this.isWriteLocked = true

            return
        }

        const waitForWrite = new Promise<void>(
            (resolve: (value?: void | PromiseLike<void>) => void): void => {
                this.writeWaiters.push(resolve)
            }
        )

        await waitForWrite
    }

    /**
     * Releases the write lock and transfers ownership to the next waiter.
     *
     * @returns Nothing.
     */
    private releaseWriteLock(): void {
        const nextWrite = this.writeWaiters.shift()

        if (nextWrite === undefined) {
            this.isWriteLocked = false

            return
        }

        nextWrite()
    }

    /**
     * Runs one synchronous container mutation with exclusive write access.
     *
     * @param operation - Synchronous operation executed while holding the lock.
     * @returns A promise containing the operation result of type `Result`.
     * @throws {Error} When the operation propagates an error.
     */
    private async withWriteLock<Result>(operation: () => Result): Promise<Result> {
        await this.acquireWriteLock()

        try {
            const result = operation()

            return result
        } finally {
            this.releaseWriteLock()
        }
    }
} //:: Container
