export const LOG = 10

export const DEBUG = 20

export const INFO = 30

export const WARN = 40

export const ERROR = 50

/**
 * @description Declares the named log-level methods equivalent to the browser console API.
 * Implementations call write() with the appropriate level constant.
 */
export interface Loggable {
  /**
   * Emits a general-purpose log entry.
   * @param {unknown} data - The value to log.
   */
  log(data: unknown): void

  /**
   * Emits a debug-level log entry.
   * @param {unknown} data - The value to log.
   */
  debug(data: unknown): void

  /**
   * Emits an informational log entry.
   * @param {unknown} data - The value to log.
   */
  info(data: unknown): void

  /**
   * Emits a warning-level log entry.
   * @param {unknown} data - The value to log.
   */
  warn(data: unknown): void

  /**
   * Emits an error-level log entry.
   * @param {unknown} data - The value to log.
   */
  error(data: unknown): void
}

/**
 * @description Declares the logging contract used by the application layer.
 * Subclasses implement write() to route entries to a specific output target.
 * Pair with the Loggable interface to expose named convenience methods.
 */
export abstract class Logger {
  [property: string]: unknown

  public name: string = 'main'

  public level: number = 0

  /**
   * Writes one log entry at the given numeric level.
   * @param {number} level - Numeric severity of this entry.
   * @param {unknown} data - The value to log.
   */
  public abstract write(level: number, data: unknown): void
} //:: Logger
