// Libraries

// Shared Module

import Service from '../../shared/application/Service.js';

// Other Modules

// Same Layer

import UsersRepository from './UsersRepository.js';

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

    protected _repository: UsersRepository;

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    public constructor(repository: UsersRepository)
    {
        super();
        this._repository = repository;
    }

    // public METHODS

    public createUser(data: {id: number, email: string}): User
    {
        return UserAggregate.createUser(data);
    }

    public store(user: User): void
    {
        this._repository.store(user);
    }

    public async list(): Promise<Array<Record<string, unknown>>>
    {
        return this._repository.all();
    }

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
