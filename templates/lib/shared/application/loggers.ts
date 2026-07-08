export const DEBUG = 10

export const INFO = 20

export const WARNING = 30

export const ERROR = 40

export const CRITICAL = 50

/**
 * @description
 */
export abstract class Logger {
    [property: string]: unknown

    public abstract debug(data: unknown): void

    public abstract info(data: unknown): void

    public abstract warning(data: unknown): void

    public abstract error(data: unknown): void

    public abstract critical(data: unknown): void
} //:: class
