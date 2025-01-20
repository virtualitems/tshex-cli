// Libraries

// Shared Module

import Repository from '../../shared/application/data/Repository.js';

// Other Modules

// Same Layer

import type IUsersDataManager from './IUsersDataManager.js';

// Lower Layers

import type User from '../domain/User.js';

import UserAggregate from '../domain/UserAggregate.js';

// Types

// Constants


/**
 * @description 
 */
export default class UsersRepository extends Repository<IUsersDataManager>
{

    [property: string | symbol]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(manager: IUsersDataManager)
    {
        super(manager);
    }

    // public METHODS

    public async all(): Promise<User[]>
    {
        await this.manager.connect();
        const raw = await this.manager.all();
        const entities = Array.from(raw).map(UserAggregate.createUser);
        await this.manager.disconnect();
        return entities;
    }

    public async store(data: User): Promise<void>
    {
        await this.manager.connect();
        await this.manager.store(data.flatten());
        await this.manager.disconnect();
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
