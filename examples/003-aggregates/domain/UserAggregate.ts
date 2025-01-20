// Libraries

// Shared Module

import Aggregate from '../../shared/domain/Aggregate.js';

// Other Modules

// Same Layer

import User from './User.js';

// Lower Layers

// Types

// Constants


/**
 * @description User aggregate root.
 */
export default class UserAggregate extends Aggregate
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    // protected METHODS

    // private METHODS

    // public static METHODS

    public static createUser(data?: {id?: number | null, email?: string | null }): User
    {

        const entity = new User(data?.id);

        if (!data) {
            return entity;
        }

        if (data.email !== undefined) {
            entity.email = data.email;
        }

        return entity;

    }

    // protected static METHODS

    // private static METHODS

} //:: class
