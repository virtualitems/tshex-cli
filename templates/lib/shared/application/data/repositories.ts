import { DriverAdapter } from './drivers.js'

/**
 * @description Represents a data source.
 */
export abstract class Repository<M extends DriverAdapter = DriverAdapter> {
    [property: string]: unknown

    public constructor(public readonly manager: M) {}

    protected abstract transform<T = Record<string, unknown>>(data: Record<string, unknown>): T
} //:: class
