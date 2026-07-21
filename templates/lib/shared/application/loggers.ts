import { type TimeZone } from '../../types/timezones'
import { type Locale } from '../../types/locales'

export const DEBUG = 10

export const INFO = 20

export const WARNING = 30

export const ERROR = 40

export const CRITICAL = 50

/**
 * @description Declares the logging contract used by the application layer.
 * Adapters implement this abstraction to send logs to external systems.
 */
export abstract class Logger {
    [property: string]: unknown

    public name: string = 'main'

    public level: number = 0

    public datetimeLocales: Locale[] = ['en-GB']

    public datetimeFormatOptions: Intl.DateTimeFormatOptions & { timeZone: TimeZone } = {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        hourCycle: 'h23'
    }

    public abstract debug(data: unknown): void

    public abstract info(data: unknown): void

    public abstract warning(data: unknown): void

    public abstract error(data: unknown): void

    public abstract critical(data: unknown): void

    protected getCurrentDatetime(): string {
        return new Date().toLocaleString(this.datetimeLocales, this.datetimeFormatOptions)
    }
} //:: class
