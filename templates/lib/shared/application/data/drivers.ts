import { DataManager } from './managers.ts'

/**
 * @description Abstract persistence session that exposes a typed data manager and a disconnection method.
 */
export abstract class SessionManager<ManagerShape extends DataManager = DataManager> {
    [property: string]: unknown

    /**
     * @description Returns the data manager scoped to the specified resource within this session.
     */
    public abstract getDataManager(...args: unknown[]): ManagerShape

    /**
     * @description Closes the session and releases the underlying persistence resources.
     */
    public abstract disconnect(): Promise<void>
} //:: SessionManager

/**
 * @description Abstract driver that opens typed persistence sessions.
 */
export abstract class DriverManager<
    SessionShape extends SessionManager = SessionManager
> {
    [property: string]: unknown

    /**
     * @description Opens and returns a new persistence session.
     */
    public abstract connect(...args: unknown[]): Promise<SessionShape>
} //:: DriverManager
