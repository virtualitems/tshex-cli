### `lib/shared/application/loggers.ts`

`loggers.ts` defines the `LOG`, `DEBUG`, `INFO`, `WARN`, and `ERROR` level
constants, the `Loggable` method interface, and the abstract `Logger` class.

#### Implement an output adapter

```ts
class ConsoleLogger extends Logger {
    public write(level: number, data: unknown): void {
        console.log(this.name, level, data)
    }
}
```

`Logger` stores a name and minimum level but does not filter entries itself.
The concrete adapter decides whether it filters, serializes, buffers, or emits
the supplied data.
