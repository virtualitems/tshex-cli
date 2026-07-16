### Loggers

The logging contracts define how the application layer emits operational
information.
They are used to keep services independent from a concrete logging library or
transport.

The generated template provides shared level constants and the abstract
`Logger` contract.

#### Log Levels

The following constants describe the generated severity scale.

| Constant | Value |
| --- | --- |
| `DEBUG` | `10` |
| `INFO` | `20` |
| `WARNING` | `30` |
| `ERROR` | `40` |
| `CRITICAL` | `50` |

These values give the project a shared vocabulary for severity without forcing
any adapter to use a particular logger implementation.

#### Logger

`Logger` is responsible for receiving log data from the application layer.

```ts title="shared/application/loggers.ts"
export abstract class Logger {
	public abstract debug(data: unknown): void

	public abstract info(data: unknown): void

	public abstract warning(data: unknown): void

	public abstract error(data: unknown): void

	public abstract critical(data: unknown): void
}
```

The contract is intentionally small. It defines the actions the application can
request, while the adapter decides how those actions are persisted or displayed.

#### First Adapter

In the following example we implement a console-based logger.

```ts title="users/adapters/console-logger.ts"
import { Logger } from '../../shared/application/loggers.js'

type ExternalService = {
    debug(data: unknown): void
    info(data: unknown): void
    warning(data: unknown): void
    error(data: unknown): void
    critical(data: unknown): void
}

export class ConsoleLogger extends Logger {
    constructor(protected readonly externalService: ExternalService) {
        super()
    }

	public debug(data: unknown): void {
		this.externalService.debug(data)
	}

	public info(data: unknown): void {
		this.externalService.info(data)
	}

	public warning(data: unknown): void {
		this.externalService.warning(data)
	}

	public error(data: unknown): void {
		this.externalService.error(data)
	}

	public critical(data: unknown): void {
		this.externalService.critical(data)
	}
}
```

This adapter satisfies the generated contract without changing the application
layer.

#### Service Integration

Now that the logger exists, an application service can depend on the contract.

```ts title="users/application/register-user.ts"
import { Service } from '../../shared/application/services.js'
import { Logger } from '../../shared/application/loggers.js'

export class RegisterUser extends Service {
	public constructor(private readonly logger: Logger) {
		super()
	}

	public async execute(email: string): Promise<void> {
		this.logger.info({
			message: 'Registering user',
			email,
		})
	}
}
```

The service does not know whether the logger writes to the console, a file, or
an external platform. It only depends on the application-level contract.

> **Hint**
> Pass structured objects when the project needs machine-readable logs. The
> generated contract accepts `unknown`, so the adapter can enforce its own shape.

#### Example Flow

```mermaid
flowchart LR
    service[Service] --> contract["Logger contract"]
    contract --> adapter[Adapter]
    adapter --> backend["Logging backend"]
```

This flow keeps observability concerns outside the core process.
