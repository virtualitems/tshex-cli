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
 * Resolves registered dependency instances.
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
 */
export class DependencyInjectionContainer<T extends DependencyMap<T>> implements DependencyResolver<T> {
    protected readonly entries: ContainerEntries<T> = Object.create(
        null
    ) as ContainerEntries<T>

    /**
     * Registers dependency factories as one atomic operation.
     *
     * @param entries - Dependency registrations of type `Registrations`.
     * @returns The current `DependencyInjectionContainer` instance.
     * @throws {Error} When any token is already registered.
     */
    register(entries: Registrations<T>): this {
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

    /**
     * Resolves a dependency and commits the graph only after successful resolution.
     *
     * @param token - Dependency token of type `Token`.
     * @returns The dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    resolve<Token extends DependencyToken<T>>(token: Token): T[Token] {
        const resolver = new Resolver<T>(this.entries)
        const instance = resolver.resolve(token)
        const resolvedEntries = Object.entries(resolver.state) as ResolvedEntry<T>[]

        for (const [key, value] of resolvedEntries) {
            this.entries[key] = value
        }

        return instance
    }

    /**
     * Reports whether a dependency token is registered.
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
     * Removes a registered dependency token.
     *
     * This operation does not invalidate dependent singleton instances that are
     * already resolved and cached.
     *
     * @param token - Dependency token of type `DependencyToken`.
     * @returns A `boolean` indicating whether a registration was removed.
     */
    unregister(token: DependencyToken<T>): boolean {
        const isRegistered = this.has(token)

        if (isRegistered === false) {
            return false
        }

        delete this.entries[token]

        return true
    }

    /**
     * Removes every dependency registration and cached instance.
     *
     * @returns Nothing.
     */
    clear(): void {
        const tokens = Object.keys(this.entries)

        for (const token of tokens) {
            delete this.entries[token]
        }
    }
} //:: DependencyInjectionContainer

/**
 * Resolves registered dependency instances asynchronously inside one dependency graph.
 */
export interface AsyncDependencyResolver<T extends DependencyMap<T>> {
    /**
     * Resolves one dependency instance by token.
     *
     * @param token - Dependency token of type `Token`.
     * @returns A `Promise` resolving to the dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    resolve<Token extends DependencyToken<T>>(token: Token): Promise<T[Token]>
}

/**
 * Creates one dependency instance asynchronously through a resolver.
 */
type AsyncFactory<
    Dependencies extends DependencyMap<Dependencies>,
    Token extends DependencyToken<Dependencies> = DependencyToken<Dependencies>
> = (resolver: AsyncDependencyResolver<Dependencies>) => Promise<Dependencies[Token]>

/**
 * Defines the async factory associated with one dependency token.
 */
interface AsyncRegistration<
    Dependencies extends DependencyMap<Dependencies>,
    Token extends DependencyToken<Dependencies>
> {
    readonly factory: AsyncFactory<Dependencies, Token>
}

/**
 * Stores an async dependency factory and its resolved singleton instance.
 */
interface AsyncContainerEntry<T extends DependencyMap<T>> {
    readonly factory: AsyncFactory<T>
    readonly instance: T[DependencyToken<T>] | null
}

/**
 * Stores async dependency entries in an object without a prototype.
 */
interface AsyncContainerEntries<T extends DependencyMap<T>> {
    [token: string]: AsyncContainerEntry<T> | undefined
}

/**
 * Represents one normalized async registration entry.
 */
type AsyncRegistrationEntry<T extends DependencyMap<T>> = [
    DependencyToken<T>,
    AsyncRegistration<T, DependencyToken<T>>
]

/**
 * Represents one resolved async container entry.
 */
type AsyncResolvedEntry<T extends DependencyMap<T>> = [DependencyToken<T>, AsyncContainerEntry<T>]

/**
 * Maps dependency tokens to their async factories.
 */
export type AsyncRegistrations<T extends DependencyMap<T>> = Partial<{
    [Token in DependencyToken<T>]: AsyncRegistration<T, Token>
}>

/**
 * Resolves one async dependency graph without committing partial results.
 */
class AsyncResolver<T extends DependencyMap<T>> implements AsyncDependencyResolver<T> {
    private readonly stack: DependencyToken<T>[] = []

    private readonly stateEntries: AsyncContainerEntries<T> = Object.create(
        null
    ) as AsyncContainerEntries<T>

    private readonly table: Readonly<AsyncContainerEntries<T>>

    /**
     * Creates an async resolver over a dependency table.
     *
     * @param table - Dependency table stored in an object without a prototype.
     */
    constructor(table: Readonly<AsyncContainerEntries<T>>) {
        this.table = table
    }

    /**
     * Returns dependencies resolved during the current graph resolution.
     *
     * @returns A readonly object containing resolved async dependency entries.
     */
    get state(): Readonly<AsyncContainerEntries<T>> {
        return this.stateEntries
    }

    /**
     * Resolves one dependency instance by token.
     *
     * @param token - Dependency token of type `Token`.
     * @returns A `Promise` resolving to the dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    async resolve<Token extends DependencyToken<T>>(token: Token): Promise<T[Token]> {
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

        const pendingEntry: AsyncContainerEntry<T> = {
            factory: entry.factory,
            instance: null
        }

        this.stateEntries[token] = pendingEntry
        this.stack.push(token)

        try {
            const instance = (await entry.factory(this)) as T[Token]
            const resolvedEntry: AsyncContainerEntry<T> = {
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
} //:: AsyncResolver

/**
 * Stores async dependency factories and resolves lazy singleton instances.
 *
 * Concurrent `resolve` calls are serialized through a promise queue so that
 * each resolution runs to completion before the next one starts.
 */
export class AsyncDependencyInjectionContainer<T extends DependencyMap<T>> {
    protected readonly entries: AsyncContainerEntries<T> = Object.create(
        null
    ) as AsyncContainerEntries<T>

    private queue: Promise<void> = Promise.resolve()

    /**
     * Registers async dependency factories as one atomic operation.
     *
     * @param entries - Async dependency registrations of type `AsyncRegistrations`.
     * @returns The current `AsyncDependencyInjectionContainer` instance.
     * @throws {Error} When any token is already registered.
     */
    register(entries: AsyncRegistrations<T>): this {
        const registrations = Object.entries(entries) as AsyncRegistrationEntry<T>[]

        for (const [token] of registrations) {
            const isRegistered = this.has(token)

            if (isRegistered === true) {
                const message = `Token ${token} is already registered`

                throw new Error(message)
            }
        }

        for (const [token, registration] of registrations) {
            const entry: AsyncContainerEntry<T> = {
                factory: registration.factory,
                instance: null
            }

            this.entries[token] = entry
        }

        return this
    }

    /**
     * Resolves a dependency asynchronously and commits the graph only after successful resolution.
     *
     * Concurrent calls are queued and executed one at a time.
     *
     * @param token - Dependency token of type `Token`.
     * @returns A `Promise` resolving to the dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is not registered or a factory propagates an error.
     */
    async resolve<Token extends DependencyToken<T>>(token: Token): Promise<T[Token]> {
        let release!: () => void

        const acquired = new Promise<void>(resolve => {
            release = resolve
        })

        const previous = this.queue
        this.queue = acquired

        await previous

        try {
            const resolver = new AsyncResolver<T>(this.entries)
            const instance = await resolver.resolve(token)
            const resolvedEntries = Object.entries(resolver.state) as AsyncResolvedEntry<T>[]

            for (const [key, value] of resolvedEntries) {
                this.entries[key] = value
            }

            return instance
        } finally {
            release()
        }
    }

    /**
     * Reports whether a dependency token is registered.
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
     * Removes a registered dependency token.
     *
     * This operation does not invalidate dependent singleton instances that are
     * already resolved and cached.
     *
     * @param token - Dependency token of type `DependencyToken`.
     * @returns A `boolean` indicating whether a registration was removed.
     */
    unregister(token: DependencyToken<T>): boolean {
        const isRegistered = this.has(token)

        if (isRegistered === false) {
            return false
        }

        delete this.entries[token]

        return true
    }

    /**
     * Removes every dependency registration and cached instance.
     *
     * @returns Nothing.
     */
    clear(): void {
        const tokens = Object.keys(this.entries)

        for (const token of tokens) {
            delete this.entries[token]
        }
    }
} //:: AsyncDependencyInjectionContainer
