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
 * Represents one prepared container entry.
 */
type PreparedEntry<T extends DependencyMap<T>> = [DependencyToken<T>, ContainerEntry<T>]

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
            const factoryResult = entry.factory(this) as unknown
            const isInstance = typeof factoryResult === 'object' && factoryResult !== null

            if (isInstance === false) {
                const message = `Factory for token ${token} must return an object instance`

                throw new Error(message)
            }

            const instance = factoryResult as T[Token]
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
 * Every mutation completes synchronously without yielding control. This keeps
 * writes atomic when callers invoke the container from asynchronous workflows.
 */
export class Container<T extends DependencyMap<T>> {
    protected readonly entries: ContainerEntries<T> = Object.create(
        null
    ) as ContainerEntries<T>

    private isWriteActive: boolean = false

    /**
     * Registers dependency factories as one atomic operation.
     *
     * @param entries - Dependency registrations of type `Registrations`.
     * @returns The current `Container` instance.
     * @throws {Error} When a token is already registered, a registration is invalid,
     * or another write is already active on the same container.
     */
    register(entries: Registrations<T>): this {
        this.beginWrite()

        try {
            const registrations = Object.entries(entries) as RegistrationEntry<T>[]
            const preparedEntries: PreparedEntry<T>[] = []

            for (const [token, registration] of registrations) {
                if (registration === undefined) {
                    const message = `Token ${token} has an invalid registration`

                    throw new Error(message)
                }

                const factory = registration.factory

                if (typeof factory !== 'function') {
                    const message = `Token ${token} has an invalid factory`

                    throw new Error(message)
                }

                const entry: ContainerEntry<T> = {
                    factory,
                    instance: null
                }

                preparedEntries.push([token, entry])
            }

            for (const [token] of preparedEntries) {
                const isRegistered = this.has(token)

                if (isRegistered === true) {
                    const message = `Token ${token} is already registered`

                    throw new Error(message)
                }
            }

            for (const [token, entry] of preparedEntries) {
                this.entries[token] = entry
            }

            return this
        } finally {
            this.endWrite()
        }
    }

    /**
     * Resolves and commits one dependency graph as one atomic operation.
     *
     * @param token - Dependency token of type `Token`.
     * @returns The dependency instance of type `T[Token]`.
     * @throws {CircularDependencyError} When the dependency graph contains a cycle.
     * @throws {Error} When the token is missing, a factory fails, or another write is
     * already active on the same container.
     */
    resolve<Token extends DependencyToken<T>>(token: Token): T[Token] {
        this.beginWrite()

        try {
            const resolver = new Resolver<T>(this.entries)
            const instance = resolver.resolve(token)
            const resolvedEntries = Object.entries(resolver.state) as ResolvedEntry<T>[]

            for (const [key, value] of resolvedEntries) {
                this.entries[key] = value
            }

            return instance
        } finally {
            this.endWrite()
        }
    }

    /**
     * Reports whether a dependency token is currently registered.
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
     * Removes one registered dependency token.
     *
     * This operation does not invalidate dependent singleton instances that are
     * already resolved and cached.
     *
     * @param token - Dependency token of type `DependencyToken`.
     * @returns A `boolean` indicating whether a registration was removed.
     * @throws {Error} When another write is already active on the same container.
     */
    unregister(token: DependencyToken<T>): boolean {
        this.beginWrite()

        try {
            const isRegistered = this.has(token)

            if (isRegistered === false) {
                return false
            }

            delete this.entries[token]

            return true
        } finally {
            this.endWrite()
        }
    }

    /**
     * Removes every dependency registration and cached instance.
     *
     * @returns Nothing.
     * @throws {Error} When another write is already active on the same container.
     */
    clear(): void {
        this.beginWrite()

        try {
            const tokens = Object.keys(this.entries)

            for (const token of tokens) {
                delete this.entries[token]
            }
        } finally {
            this.endWrite()
        }
    }

    /**
     * Starts one synchronous write section.
     *
     * @returns Nothing.
     * @throws {Error} When another write is already active on the same container.
     */
    private beginWrite(): void {
        if (this.isWriteActive === true) {
            throw new Error('Container write is already in progress')
        }

        this.isWriteActive = true
    }

    /**
     * Ends the current synchronous write section.
     *
     * @returns Nothing.
     */
    private endWrite(): void {
        this.isWriteActive = false
    }
} //:: Container
