/**
 * @description Represents something that occurred in the application.
 * It carries the event time and its plain details.
 */
export abstract class Event {
    [property: string]: unknown

    public constructor(
        public readonly timestamp: number = Date.now(),
        public readonly details: Record<string, unknown> = {}
    ) {}
} //:: class

/**
 * @description Represents a reaction to an application event.
 */
export abstract class EventHandler {
    [property: string]: unknown

    public abstract handle(event: Event): Promise<void>
} //:: class

/**
 * @description Declares the interaction contract with an event bus.
 * It subscribes handlers, removes subscriptions, and dispatches events.
 */
export abstract class EventDispatcher {
    [property: string]: unknown

    public abstract subscribe(key: unknown, handler: EventHandler): void

    public abstract unsubscribe(key: unknown, handler: EventHandler): void

    public abstract dispatch(event: Event): void
} //:: class
