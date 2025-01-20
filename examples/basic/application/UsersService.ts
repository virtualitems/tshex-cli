// Libraries

// Shared Module

import Service from '../../shared/application/Service.js';

// Other Modules

// Same Layer

// Lower Layers

import User from '../domain/User.js';

// Types

// Constants


/**
 * @description 
 */
export default class UsersService extends Service
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

    public static create(id: number): User
    {
        return new User(id);
    }

    // protected static METHODS

    // private static METHODS

} //:: class
