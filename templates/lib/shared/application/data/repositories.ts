import { type DataManager } from './managers.js'
import { type DriverAdapter } from './drivers.js'

/**
 * @description Represents a data source.
 */
export abstract class Repository<
    DataShape extends Record<string, unknown> = Record<string, unknown>,
    EntityShape extends Record<string, unknown> = Record<string, unknown>
> {
    [property: string]: unknown

    public constructor(public readonly driver: DriverAdapter<DataManager<DataShape>>) {}

    public async all(): Promise<Array<EntityShape>> {
        const connection = await this.driver.connect()
        const raw = await connection.all()
        const entities = this.transformList(raw)
        await this.driver.disconnect()
        return entities
    }

    protected transformList(data: Array<DataShape>): Array<EntityShape> {
        return data.map(this.transform)
    }

    protected abstract transform(data: DataShape): EntityShape
} //:: class
