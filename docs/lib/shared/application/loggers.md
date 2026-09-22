### `lib/shared/application/loggers.ts`

Logger is the application boundary for recording operational information. It
associates each entry with a logger name and severity level, then delegates the
entry to an output adapter. The adapter determines how and where the entry is
recorded.

`LOG`, `DEBUG`, `INFO`, `WARN`, and `ERROR` define the available severity
levels. `Loggable` defines the methods that expose those levels.

#### Current implementation

The following code is the current implementation of the log levels,
`Loggable`, and `Logger`.

```ts
export const LOG = 0

export const DEBUG = 10

export const INFO = 20

export const WARN = 30

export const ERROR = 40

export interface Loggable {
    log(data: unknown): void

    debug(data: unknown): void

    info(data: unknown): void

    warn(data: unknown): void

    error(data: unknown): void
}

export abstract class Logger {
    [property: string]: unknown

    constructor(
        public readonly name: string = 'main',
        public readonly level: number = LOG
    ) {}

    public abstract write(level: number, data: unknown): void
}
```

#### Example

`FileLogger` receives the path of an existing file and writes `date`, `namespace`,
`priority`, and `message` as semicolon-separated columns.

```ts
import { DEBUG, ERROR, INFO, LOG, Loggable, Logger, WARN } from './lib/shared/application/loggers.ts'

class FileLogger extends Logger implements Loggable {
  protected readonly filePath: string

  public constructor(filePath: string, name: string = 'main', level: number = LOG) {
    super(name, level)
    this.filePath = filePath
  }

  public write(level: number, data: string): void {
    const namespace = this.name
    const priority = String(level)
    const date = new Date().toISOString()
    const logLine = `${date};${namespace};${priority};${data}\n`

    Deno.writeTextFileSync(this.filePath, logLine, { append: true })
  }

  public log(data: string): void {
    this.write(LOG, data)
  }

  public debug(data: string): void {
    this.write(DEBUG, data)
  }

  public info(data: string): void {
    this.write(INFO, data)
  }

  public warn(data: string): void {
    this.write(WARN, data)
  }

  public error(data: string): void {
    this.write(ERROR, data)
  }

}

const logger = new FileLogger('./application.log', 'enrollment')

logger.info('Student enrolled successfully.')
```
