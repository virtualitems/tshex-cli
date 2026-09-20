/**
 * @description Abstract base for domain events that carry a timestamp and optional details.
 */
export abstract class Event {
    [property: string]: unknown

    public constructor(
        public readonly timestamp: number = Date.now(),
        public readonly details: Record<string, unknown> = {}
    ) {}
} //:: class

/**
 * @description Abstract handler that processes a specific domain event type.
 */
export abstract class EventHandler {
    [property: string]: unknown

    public abstract handle(event: Event): void
} //:: class

/**
 * @description Abstract dispatcher that routes domain events to their registered handlers.
 */
export abstract class EventDispatcher {
    [property: string]: unknown

    public abstract subscribe(key: unknown, handler: EventHandler): void

    public abstract unsubscribe(key: unknown, handler: EventHandler): void

    public abstract dispatch(event: Event): void
} //:: class
