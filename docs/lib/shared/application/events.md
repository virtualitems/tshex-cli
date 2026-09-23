### `lib/shared/application/events.ts`

This module provides the contracts used to communicate application events
between components. It defines how an occurrence is represented, handled, and
routed. Implementations determine persistence, delivery ordering, retries, and
whether dispatch is asynchronous.

#### Current implementation

The following code is the current module implementation.

```ts
export abstract class Event {
    [property: string]: unknown

    public constructor(
        public readonly timestamp: number = Date.now(),
        public readonly details: Record<string, unknown> = {}
    ) {}
}

export abstract class EventHandler {
    [property: string]: unknown

    public abstract handle(event: Event): void
}

export abstract class EventDispatcher {
    [property: string]: unknown

    public abstract subscribe(key: unknown, handler: EventHandler): void

    public abstract unsubscribe(key: unknown, handler: EventHandler): void

    public abstract dispatch(event: Event): void
}
```

#### Example

The dispatcher registers a handler under an event type. The global flow
creates and dispatches an event of that type. The dispatcher then invokes the
registered handler.

```ts
class StudentCreated extends Event {}

class InMemoryEventDispatcher extends EventDispatcher {
  protected readonly handlers = new Map<unknown, EventHandler[]>()

  public subscribe(key: unknown, handler: EventHandler): void {
    const registeredHandlers = this.handlers.get(key)

    if (registeredHandlers === undefined) {
      this.handlers.set(key, [handler])
      return
    }

    registeredHandlers.push(handler)
  }

  public unsubscribe(key: unknown, handler: EventHandler): void {
    const registeredHandlers = this.handlers.get(key)

    if (registeredHandlers === undefined) {
      return
    }

    const remainingHandlers = registeredHandlers.filter(
      (registeredHandler: EventHandler): boolean => registeredHandler !== handler
    )

    if (remainingHandlers.length === 0) {
      this.handlers.delete(key)
      return
    }

    this.handlers.set(key, remainingHandlers)
  }

  public dispatch(event: Event): void {
    const key = event.constructor.name
    const registeredHandlers = this.handlers.get(key)

    if (registeredHandlers === undefined) {
      return
    }

    for (const registeredHandler of registeredHandlers) {
      registeredHandler.handle(event)
    }
  }
}

class StudentCreatedHandler extends EventHandler {
  public readonly receivedEvents: StudentCreated[] = []

  public handle(event: Event): void {
    const isStudentCreated = event instanceof StudentCreated

    if (isStudentCreated === false) {
      return
    }

    this.receivedEvents.push(event)
  }
}

const dispatcher = new InMemoryEventDispatcher()
const handler = new StudentCreatedHandler()

dispatcher.subscribe('StudentCreated', handler)

const timestamp = Date.now()
const details = { studentID: 204 }
const event = new StudentCreated(timestamp, details)

dispatcher.dispatch(event)
```
