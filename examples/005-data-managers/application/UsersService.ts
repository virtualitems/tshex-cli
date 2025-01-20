// Libraries

// Shared Module

import Service from '../../shared/application/Service.js';

// Other Modules

// Same Layer

import IUsersDataManager from './IUsersDataManager.js';

// Lower Layers

import UserAggregate from '../domain/UserAggregate.js';
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

    protected _manager: IUsersDataManager;

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(manager: IUsersDataManager)
    {
        super();
        this._manager = manager;
    }

    // public METHODS

    public createUser(data: {id: number, email: string}): User
    {
        return UserAggregate.createUser(data);
    }

    public store(user: User): void
    {
        this._manager.connect();
        this._manager.store(user.flatten());
        this._manager.disconnect();
    }

    public async list(): Promise<Array<Record<string, unknown>>>
    {
        this._manager.connect();
        const list = await this._manager.all();
        this._manager.disconnect();
        return list;
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
