import { type DataManager } from './managers.js'
import { type DriverAdapter } from './drivers.js'

type Generic = Record<string, unknown>

/**
 * @description Acts as an intermediary between plain source data and domain objects.
 * It transforms records into domain representations and can translate them back when needed.
 */
export abstract class Repository<RawDataShape = Generic, EntityShape = Generic> {
    [property: string]: unknown

    public constructor(public readonly driver: DriverAdapter<DataManager<RawDataShape>>) {}

    protected abstract transform(data: RawDataShape): EntityShape
} //:: class
