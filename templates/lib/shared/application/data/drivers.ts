import { DataManager } from './managers.js'

/**
 * @description Declares the connection contract with a data source driver.
 * It connects to the source, returns an enabled data manager, and disconnects when the work is done.
 * This declaration belongs to the application layer as a contract,
 * while its concrete implementation belongs to the adapters layer.
 */
export abstract class DriverAdapter<M extends DataManager = DataManager> {
    [property: string]: unknown

    public abstract connect(...args: unknown[]): Promise<M>

    public abstract disconnect(): Promise<unknown>
} //:: class
