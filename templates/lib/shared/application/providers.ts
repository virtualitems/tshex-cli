class CircularDependencyError extends Error {
    constructor(token: string) {
        super(`Circular dependency detected for ${token}`)
        this.name = 'CircularDependencyError'
    }
}

type ContainerEntry<T = unknown> = {
    instance: T | null
    factory: (r: Resolver) => T
}

type Registration<T> = {
    factory: (resolver: Resolver) => T
}

class Resolver {
    state: Map<string, ContainerEntry> = new Map()

    constructor(private table: Map<string, ContainerEntry>) {}

    resolve<T>(token: string): T {
        if (!this.table.has(token)) {
            throw new Error(`Token ${token} is not registered`)
        }

        if (this.state.has(token)) {
            const entry = this.state.get(token)!

            if (entry.instance === null) {
                throw new CircularDependencyError(token)
            }

            return entry.instance as T
        }

        const entry = this.table.get(token)!

        if (entry.instance !== null) {
            this.state.set(token, entry)
            return entry.instance as T
        }

        const stateEntry: ContainerEntry = { factory: entry.factory, instance: null }

        this.state.set(token, stateEntry)

        const instance = entry.factory(this)

        stateEntry.instance = instance

        return instance as T
    }
}

/**
 * Dependency injection container with lazy singleton pattern.
 *
 * @example
 * container.register({
 *   Database: { factory: () => new Database() },
 *   UserService: { factory: (r) => new UserService(r.resolve<Database>('Database')) },
 * });
 * const svc = container.resolve<UserService>('UserService');
 */
export class Container {
    protected entries: Map<string, ContainerEntry> = new Map()

    register(entries: Record<string, Registration<unknown>>): this {
        for (const [token, entry] of Object.entries(entries)) {
            if (this.has(token)) {
                throw new Error(`Token ${token} is already registered`)
            }
            this.entries.set(token, { factory: entry.factory, instance: null })
        }
        return this
    }

    resolve<T>(token: string): T {
        const resolver = new Resolver(this.entries)
        const instance = resolver.resolve<T>(token)

        for (const [key, value] of resolver.state) {
            this.entries.set(key, value)
        }

        return instance
    }

    has(token: string): boolean {
        return this.entries.has(token)
    }

    /**
     * WARNING: Does not invalidate dependent instances already resolved and cached.
     */
    unregister(token: string): boolean {
        return this.entries.delete(token)
    }

    clear(): void {
        this.entries.clear()
    }
}
