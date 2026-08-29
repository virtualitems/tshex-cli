import { type DataManager } from './managers.js'

type Generic = Record<string, unknown>

/**
 * @description Acts as an intermediary between plain source data and domain objects.
 * It transforms records into domain representations and can translate them back when needed.
 */
export abstract class Repository<RawDataShape = Generic, EntityShape = Generic, M extends DataManager<RawDataShape> = DataManager<RawDataShape>> {
    [property: string]: unknown

    public constructor(
        public readonly manager: M
    ) {}

    protected abstract transform(data: RawDataShape, ...args: unknown[]): EntityShape
} //:: class
