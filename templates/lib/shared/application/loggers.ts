export const LOG = 0

export const DEBUG = 10

export const INFO = 20

export const WARN = 30

export const ERROR = 40

/**
 * @description Contract for objects that expose structured log methods at multiple severity levels.
 */
export interface Loggable {
    log(data: unknown): void

    debug(data: unknown): void

    info(data: unknown): void

    warn(data: unknown): void

    error(data: unknown): void
}

/**
 * @description Abstract logger identified by a name and a minimum severity level filter.
 */
export abstract class Logger {
    [property: string]: unknown

    constructor(
        public readonly name: string = 'main',
        public readonly level: number = LOG
    ) {}

    /**
     * @description Writes a log entry at the given severity level.
     */
    public abstract write(level: number, data: unknown): void
} //:: Logger
