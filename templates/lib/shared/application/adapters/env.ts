export const env: Record<string, string> = {}

function required(env: Record<string, string>, key: string): string {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }
    
    return trimmed
}

function asInteger(env: Record<string, string>, key: string): number {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    const transformed = Number(trimmed)

    if (Number.isInteger(transformed) === false) {
        throw new Error(`Environment variable "${key}" must be an integer`)
    }

    return transformed
}

function asFloat(env: Record<string, string>, key: string): number {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    const transformed = Number(trimmed)

    if (Number.isFinite(transformed) === false) {
        throw new Error(`Environment variable "${key}" must be a float`)
    }

    return transformed
}

function asBoolean(env: Record<string, string>, key: string, truthy: string[], falsy: string[]): boolean {
    if (Object.hasOwn(env, key) === false) {
        throw new Error(`Environment variable "${key}" is required`)
    }

    const trimmed = env[key].trim()

    if (trimmed === '') {
        throw new Error(`Environment variable "${key}" cannot be empty`)
    }

    if (truthy.includes(trimmed)) {
        return true
    }

    if (falsy.includes(trimmed)) {
        return false
    }

    throw new Error(`Environment variable "${key}" must be a defined boolean value`)
}
