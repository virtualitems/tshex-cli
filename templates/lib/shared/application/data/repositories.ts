import { type DataManager } from './managers.ts'
import { Entity, Identifiable } from '../../domain/entities.ts'

type Generic = Record<string, unknown>

/**
 * @description Contract for repositories that can list all items.
 */
export interface Listable<ItemShape = Entity> {
    all(): Array<ItemShape>
}

/**
 * @description Contract for repositories that can filter items by criteria.
 */
export interface Filterable<ItemShape = Entity> {
    filter(...args: unknown[]): Array<ItemShape>
}

/**
 * @description Contract for repositories that can update an existing item.
 */
export interface Updateable<
    ItemShape = Entity & Identifiable,
    ResultShape extends unknown = boolean
> {
    update(target: ItemShape, data: Partial<ItemShape>): ResultShape
}

/**
 * @description Contract for repositories that can persist a new item.
 */
export interface Creatable<
    ItemShape = Entity,
    ResultShape extends unknown = boolean
> {
    create(data: ItemShape): ResultShape
}

/**
 * @description Contract for repositories that can remove an existing item.
 */
export interface Deletable<
    ItemShape = Entity & Identifiable,
    ResultShape extends unknown = boolean
> {
    delete(target: ItemShape): ResultShape
}

/**
 * @description Abstract base for data repositories that transform persistence records into domain entities.
 */
export abstract class Repository<
    ManagerShape = DataManager
> {
    [property: string]: unknown

    public constructor(
        public readonly manager: ManagerShape
    ) {}

    /**
     * @description Transforms a raw persistence record into a domain entity.
     */
    protected abstract transform(data: Generic): Entity
} //:: class
