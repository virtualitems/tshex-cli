/**
 * @description
 */
export abstract class Event {
    [property: string]: unknown

    public constructor(
        public readonly timestamp: number = Date.now(),
        public readonly details: Record<string, unknown> = {}
    ) {}
} //:: class

/**
 * @description
 */
export abstract class EventHandler {
    [property: string]: unknown

    public abstract handle(event: Event): Promise<void>
} //:: class

/**
 * @description
 */
export abstract class EventDispatcher {
    [property: string]: unknown

    public abstract subscribe(key: unknown, handler: EventHandler): void

    public abstract unsubscribe(key: unknown, handler: EventHandler): void

    public abstract dispatch(event: Event): void
} //:: class
