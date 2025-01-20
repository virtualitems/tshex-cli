import type User from './domain/User.js';

import UsersArrayDataManager from './adapters/UsersArrayDataManager.js';
import CreateUserDTO from './application/CreateUserDTO.js';
import UsersService from './application/UsersService.js';
import UsersRepository from './application/UsersRepository.js';


const database: User[] = [];

const manager = new UsersArrayDataManager(database);

const repository = new UsersRepository(manager);

const usersService = new UsersService(repository);

const userdto = new CreateUserDTO(1,'user.1@example.com');

const user1 = usersService.createUser(userdto);

usersService.store(user1);

usersService.list().then(console.log);
