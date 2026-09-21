### Loggers

`shared/application/loggers.ts` defines five numeric log levels, the `Loggable`
convenience interface, and the abstract `Logger` base class.

| Constant | Value |
| --- | --- |
| `LOG` | `0` |
| `DEBUG` | `10` |
| `INFO` | `20` |
| `WARN` | `30` |
| `ERROR` | `40` |

`Logger` receives a name and a minimum level. A concrete adapter implements
`write()` and decides how to emit the data.

```ts
import { INFO, Logger } from './shared/application/loggers.ts'

class ConsoleLogger extends Logger {
    public write(level: number, data: unknown): void {
        if (level < this.level) {
            return
        }

        console.log(this.name, level, data)
    }
}

const logger = new ConsoleLogger('users', INFO)

logger.write(INFO, { action: 'created', id: 204 })
// users 20 { action: 'created', id: 204 }
```

The level filter in the example belongs to the adapter. `Logger` itself only
stores `name` and `level`; it does not enforce filtering or output format.
Implement `Loggable` when callers need named methods such as `info()` and
`error()`.
