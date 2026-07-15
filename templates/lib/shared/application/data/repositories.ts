import { DriverAdapter } from './drivers.js'

/**
 * @description Represents a data source.
 */
export abstract class Repository<
    DataShape extends Record<string, unknown> = Record<string, unknown>,
    EntityShape extends Record<string, unknown> = Record<string, unknown>
> {
    [property: string]: unknown

    public constructor(public readonly manager: DriverAdapter) {}

    protected abstract transform(data: DataShape): EntityShape

    protected transformList(data: Array<DataShape>): Array<EntityShape> {
        return data.map(this.transform)
    }
} //:: class
