import { DataManager } from './managers.js'

/**
 * @description
 */
export abstract class DriverAdapter<M extends DataManager = DataManager> {
    [property: string]: unknown

    public abstract connect(...args: unknown[]): Promise<M>

    public abstract disconnect(): Promise<unknown>
} //:: class
